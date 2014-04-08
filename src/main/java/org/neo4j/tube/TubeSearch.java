package org.neo4j.tube;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.googlecode.totallylazy.Pair;
import com.googlecode.totallylazy.Sequence;

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
            PathFinder<WeightedPath> shortestPath = GraphAlgoFactory.aStar( expander, runningTime(),
                    new NaiveEstimateEvaluator() );
            Pair<Node, Node> stationNodes = getStations( executionEngine, from, to );
            long start = System.currentTimeMillis();
            Iterable<WeightedPath> paths = shortestPath.findAllPaths( stationNodes.first(), stationNodes.second() );

            List<Stop> route = new ArrayList<>();
            for ( WeightedPath path : paths )
            {
                System.out.println( "duration = " + path.weight() );

                for ( Relationship relationship : path.relationships() )
                {
                    if ( relationship.isType( withName( "AT" ) ) )
                    {
                        Node platform = relationship.getStartNode();
                        Node direction = platform.getSingleRelationship( withName( "ON" ), OUTGOING ).getEndNode();
                        Node line = direction.getSingleRelationship( withName( "DIRECTION" ), INCOMING ).getStartNode();

                        String stationName = relationship.getEndNode().getProperty( "stationName" ).toString();
                        String lineName = line.getProperty( "lineName" ).toString();
                        String directionName = direction.getProperty( "direction" ).toString();
                        route.add( new Stop( stationName, lineName, directionName ) );
                    }

                    if ( relationship.isType( withName( "WAIT" ) ) )
                    {
                        Node platform1 = relationship.getStartNode();
                        Node platform1Direction = platform1.getSingleRelationship( withName( "ON" ),
                                OUTGOING ).getEndNode();
                        Node platform1Line = platform1Direction.getSingleRelationship( withName( "DIRECTION" ),
                                INCOMING ).getStartNode();
                        Node platform1Station = platform1.getSingleRelationship( withName( "AT" ),
                                OUTGOING ).getEndNode();

                        String stationName = platform1Station.getProperty( "stationName" ).toString();
                        String lineName = platform1Line.getProperty( "lineName" ).toString();
                        String direction = platform1Direction.getProperty( "direction" ).toString();
                        route.add( new Stop( stationName, lineName, direction ) );
                    }
                }
            }
            tx.success();
            long end = System.currentTimeMillis();

            List<Instruction> instructions = new ArrayList<>(  );

            Sequence<Stop> routeSeq = sequence( route );

            InstructionBuilder nextInstruction = null;
            if ( routeSeq.size() > 0 )
            {
                String line = null;
                for ( Stop stop : routeSeq )
                {
                    if ( line == null )
                    {
                        nextInstruction = new InstructionBuilder().line( stop.line ).direction( stop.direction );
                        line = stop.line;
                    }

                    if ( !stop.line.equals( line ) )
                    {
                        nextInstruction.endStation( stop.station );
                        instructions.add( nextInstruction.build() );
                        nextInstruction = new InstructionBuilder().line( stop.line ).direction( stop.direction );
                        line = stop.line;
                    }
                }
                Stop lastStop = routeSeq.last();
                instructions.add( nextInstruction.endStation( lastStop.station ).build() );
            }

            return new TubeSearchResult(instructions);
        }
    }

    private static class NaiveEstimateEvaluator implements EstimateEvaluator<Double>
    {
        @Override
        public Double getCost( Node node, Node goal )
        {
            return 1.0;
        }
    }

    static class Stop
    {
        private String station;
        private String line;
        private String direction;

        Stop( String station, String line, String direction )
        {

            this.station = station;
            this.line = line;
            this.direction = direction;
        }

        @Override
        public String toString()
        {
            return "Stop{" +
                    "station='" + station + '\'' +
                    ", line='" + line + '\'' +
                    ", direction='" + direction + '\'' +
                    '}';
        }
    }

    private static Pair<Node, Node> getStations( ExecutionEngine executionEngine, String from, String to )
    {
        ExecutionResult result = executionEngine.execute(
                "MATCH (startStation:Station { stationName: {from}}), " +
                        "(destinationStation:Station { stationName: {to}})\n" +
                        "return startStation, destinationStation", MapUtil.map( "from", from, "to", to ) );
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
