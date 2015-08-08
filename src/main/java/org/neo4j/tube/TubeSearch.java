package org.neo4j.tube;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.googlecode.totallylazy.Callable1;
import com.googlecode.totallylazy.Callable2;
import com.googlecode.totallylazy.Pair;
import com.googlecode.totallylazy.Sequence;
import com.googlecode.totallylazy.Sequences;
import com.googlecode.totallylazy.numbers.Numbers;

import org.neo4j.cypher.javacompat.ExecutionEngine;
import org.neo4j.cypher.javacompat.ExecutionResult;
import org.neo4j.graphalgo.CostEvaluator;
import org.neo4j.graphalgo.EstimateEvaluator;
import org.neo4j.graphalgo.GraphAlgoFactory;
import org.neo4j.graphalgo.PathFinder;
import org.neo4j.graphalgo.WeightedPath;
import org.neo4j.graphdb.Direction;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.PathExpander;
import org.neo4j.graphdb.Relationship;
import org.neo4j.graphdb.Transaction;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;
import org.neo4j.helpers.collection.MapUtil;

import static com.googlecode.totallylazy.Sequences.sequence;

import static org.neo4j.graphdb.Direction.INCOMING;
import static org.neo4j.graphdb.Direction.OUTGOING;
import static org.neo4j.graphdb.DynamicRelationshipType.withName;

public class TubeSearch
{

    private final GraphDatabaseService db;
    private final ExecutionEngine executionEngine;

    public TubeSearch( String storeDir )
    {
        db = new GraphDatabaseFactory().newEmbeddedDatabase( storeDir );
        executionEngine = new ExecutionEngine( db );
    }

    public TubeSearchResult between( String from, String to, PathExpander expander )
    {

        try ( Transaction tx = db.beginTx() )
        {
            PathFinder<WeightedPath> shortestPath = GraphAlgoFactory.aStar( expander, runningTime(), new NaiveEstimateEvaluator() );
            Pair<Node, Node> stationNodes = getStations( executionEngine, from, to );
            Iterable<WeightedPath> paths = shortestPath.findAllPaths( stationNodes.first(), stationNodes.second() );

            List<Stop> route = new ArrayList<>();
            double totalDuration = 0;
            for ( WeightedPath path : paths )
            {
                totalDuration = path.weight();

                double durationSinceLastStop = 0;
                for ( Relationship relationship : path.relationships() )
                {
                    if ( relationship.isType( withName( "TRAIN" ) ) || relationship.isType( withName( "WAIT" ) ) )
                    {
                        double duration = (double) relationship.getProperty( "runningTime" );
                        durationSinceLastStop += duration;
                    }

                    if ( relationship.isType( withName( "AT" ) ) )
                    {
                        Node platform = relationship.getStartNode();
                        Node direction = platform.getSingleRelationship( withName( "ON" ), OUTGOING ).getEndNode();
                        Node line = direction.getSingleRelationship( withName( "DIRECTION" ), INCOMING ).getStartNode();

                        String stationName = relationship.getEndNode().getProperty( "stationName" ).toString();
                        String lineName = line.getProperty( "lineName" ).toString();
                        String directionName = direction.getProperty( "direction" ).toString();
                        route.add( new Stop( stationName, lineName, directionName, durationSinceLastStop ) );
                        durationSinceLastStop = 0;
                    }

                    if ( relationship.isType( withName( "WAIT" ) ) )
                    {
                        Node platform1 = relationship.getStartNode();
                        Node platform1Direction = platform1.getSingleRelationship( withName( "ON" ), OUTGOING ).getEndNode();
                        Node platform1Line = platform1Direction.getSingleRelationship( withName( "DIRECTION" ), INCOMING ).getStartNode();
                        Node platform1Station = platform1.getSingleRelationship( withName( "AT" ), OUTGOING ).getEndNode();

                        String stationName = platform1Station.getProperty( "stationName" ).toString();
                        String lineName = platform1Line.getProperty( "lineName" ).toString();
                        String direction = platform1Direction.getProperty( "direction" ).toString();
                        route.add( new Stop( stationName, lineName, direction, durationSinceLastStop ) );
                        durationSinceLastStop = 0;
                    }
                }
            }
            tx.success();

            List<Instruction> instructions = asInstructions( route );

            return new TubeSearchResult(totalDuration, instructions);
        }
    }

    public static List<Instruction> asInstructions( List<Stop> route )
    {
        List<Instruction> instructions = new ArrayList<>(  );

        Sequence<Stop> routeSeq = sequence( route );

        InstructionBuilder nextInstruction = null;
        double duration = 0;
        if ( routeSeq.size() > 0 )
        {
            String line = null;
            for ( Stop stop : routeSeq )
            {
                duration += stop.getDurationSinceLastStop();
                if ( line == null )
                {
                    nextInstruction = new InstructionBuilder().line( stop.getLine() ).direction( stop.getDirection() );
                    line = stop.getLine();
                }

                if ( !stop.getLine().equals( line ) )
                {
                    nextInstruction.endStation( stop.getStation() ).duration( duration );
                    instructions.add( nextInstruction.build() );

                    nextInstruction = new InstructionBuilder().line( stop.getLine() ).direction( stop.getDirection() );
                    duration = 0;
                    line = stop.getLine();
                }
            }
            Stop lastStop = routeSeq.last();
            instructions.add( nextInstruction.endStation( lastStop.getStation() ).duration( duration ).build() );
        }
        return instructions;
    }

    public static List<Instruction> asInstructionsAlt(List<Stop> stops) {
        final Sequence<Stop> stopsAsSeq = sequence( stops );
        Pair<Sequence<Stop>, Sequence<Instruction>> result = stopsAsSeq.foldLeft( Pair.pair( Sequences
                .<Stop>sequence(), Sequences.<Instruction>sequence() ),
                new Callable2<Pair<Sequence<Stop>, Sequence<Instruction>>, Stop, Pair<Sequence<Stop>,
                        Sequence<Instruction>>>()

                {
                    @Override
                    public Pair<Sequence<Stop>, Sequence<Instruction>> call( Pair<Sequence<Stop>,
                            Sequence<Instruction>> acc, Stop stop ) throws Exception
                    {
                        Sequence<Stop> stops = acc.first();
                        if ( stops.isEmpty() )
                        {
                            return Pair.pair( sequence( stop ), acc.second() );
                        }
                        else if ( stop.getStation().equals( stopsAsSeq.last().getStation() ) )
                        {
                            Stop lastStop = stops.last();
                            Instruction i = new Instruction( lastStop.getLine(), lastStop.getDirection(),
                                    stopsAsSeq.last().getStation(), calculateDuration( stops ).doubleValue() );
                            return Pair.pair( Sequences.<Stop>sequence(), acc.second().add( i ) );
                        }
                        else
                        {
                            Stop lastStop = stops.last();
                            if ( !lastStop.getLine().equals( stop.getLine() ) )
                            {
                                Instruction i = new Instruction( lastStop.getLine(), lastStop.getDirection(),
                                        lastStop.getStation(), calculateDuration( stops ).doubleValue() );
                                return Pair.pair( Sequences.<Stop>sequence(), acc.second().add( i ) );
                            }
                            else
                            {

                                    return Pair.pair( stops.add( stop ), acc.second() );
                            }
                        }
                    }
                } );
        return result.second().toList();
    }

    private static Number calculateDuration( Sequence<Stop> stops )
    {
        return stops.map( new Callable1<Stop, Double>()
        {
            @Override
            public Double call( Stop stop ) throws Exception
            {
                return stop.getDurationSinceLastStop();
            }
        } ).reduce( Numbers.sum() );
    }

    private static class NaiveEstimateEvaluator implements EstimateEvaluator<Double>
    {
        @Override
        public Double getCost( Node node, Node goal )
        {
            return 1.0;
        }
    }

    private static Pair<Node, Node> getStations( ExecutionEngine executionEngine, String from, String to )
    {
        ExecutionResult result = executionEngine.execute(
                "MATCH (startStation:Station { stationName: {from}}), " +
                        "(destinationStation:Station { stationName: {to}})\n" +
                        "return startStation, destinationStation", MapUtil.map( "from", from.toUpperCase(), "to", to.toUpperCase() ) );
        Map<String, Object> row = result.iterator().next();
        Node startStation = (Node) row.get( "startStation" );
        Node destinationStation = (Node) row.get( "destinationStation" );

        return Pair.pair( startStation, destinationStation );
    }

    private static CostEvaluator<Double> runningTime()
    {
        return new CostEvaluator<Double>()
        {
            @Override
            public Double getCost( Relationship relationship, Direction direction )
            {
                if ( relationship.getType().name().equals( "AT" ) )
                {
                    return 1.0;
                }
                return ((double) relationship.getProperty( "runningTime" ));
            }
        };
    }
}
