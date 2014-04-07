package tube;

import java.io.IOException;
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
import org.neo4j.graphdb.DynamicLabel;
import org.neo4j.graphdb.DynamicRelationshipType;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Label;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.PathExpander;
import org.neo4j.graphdb.Relationship;
import org.neo4j.graphdb.RelationshipType;
import org.neo4j.graphdb.Transaction;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;
import org.neo4j.helpers.Predicate;
import org.neo4j.helpers.collection.MapUtil;
import org.neo4j.kernel.StandardExpander;

import static com.googlecode.totallylazy.Sequences.sequence;

import static org.neo4j.graphdb.Direction.INCOMING;
import static org.neo4j.graphdb.Direction.OUTGOING;
import static org.neo4j.graphdb.DynamicRelationshipType.withName;

//import java.util.function.Supplier;
//import java.util.stream.IntStream;
//import java.util.stream.Stream;

public class TubeImporter
{
    private static final String STORE_DIR = "/Users/markneedham/Downloads/neo4j-community-2.1.0-M01/data/graph.db";
    private static final Label IN_PLATFORM = DynamicLabel.label( "InPlatform" );
    private static final Label OUT_PLATFORM = DynamicLabel.label( "OutPlatform" );
    private static final DynamicRelationshipType AT = withName( "AT" );

    public static void main( String[] args ) throws IOException
    {

        GraphDatabaseService db = new GraphDatabaseFactory().newEmbeddedDatabase( STORE_DIR );
        ExecutionEngine executionEngine = new ExecutionEngine( db );

        Sequence<Pair<String, String>> pairsOfStations = sequence(
//                Pair.pair( "AMERSHAM", "MORDEN" ),
//                Pair.pair( "GRANGE HILL", "EMBANKMENT" ),
                Pair.pair( "PADDINGTON", "SOUTHWARK" ),
//                Pair.pair( "HEATHROW 123", "SOUTHWARK" ),
                Pair.pair( "OVAL", "HEATHROW 123" )
        );

        Sequence<PathExpander> expanders = sequence( allConnections(), skipSomeConnections() );

        for ( Pair<String, String> stations : pairsOfStations )
        {
            for ( PathExpander expander : expanders )
            {
                try ( Transaction tx = db.beginTx() )
                {

                    PathFinder<WeightedPath> shortestPath = GraphAlgoFactory.aStar( expander, runningTime(),
                            new NaiveEstimateEvaluator() );

                    String from = stations.first();
                    String to = stations.second();

                    Pair<Node, Node> stationNodes = getStations( executionEngine, from, to );
                    long start = System.currentTimeMillis();
                    Iterable<WeightedPath> paths = shortestPath.findAllPaths(stationNodes.first(), stationNodes.second());

                    List<Stop> route = new ArrayList<>(  );
                    for ( WeightedPath path : paths )
                    {
                        System.out.println( "duration = " + path.weight() );

                        for (Relationship relationship : path.relationships()) {
                            if(relationship.isType(withName("AT"))) {
                                Node platform = relationship.getStartNode();
                                Node direction = platform.getSingleRelationship(withName("ON"), OUTGOING).getEndNode();
                                Node line = direction.getSingleRelationship(withName("DIRECTION"), INCOMING).getStartNode();

                                String stationName = relationship.getEndNode().getProperty( "stationName" ).toString();
                                String lineName = line.getProperty( "lineName" ).toString();
                                String directionName = direction.getProperty( "direction" ).toString();
                                route.add( new Stop( stationName, lineName, directionName ) );
                            }

                            if(relationship.isType(withName("WAIT"))) {
                                Node platform1 = relationship.getStartNode();
                                Node platform1Direction = platform1.getSingleRelationship(withName("ON"), OUTGOING).getEndNode();
                                Node platform1Line = platform1Direction.getSingleRelationship(withName("DIRECTION"), INCOMING).getStartNode();
                                Node platform1Station = platform1.getSingleRelationship(withName("AT"), OUTGOING).getEndNode();

                                String stationName = platform1Station.getProperty( "stationName" ).toString();
                                String lineName = platform1Line.getProperty( "lineName" ).toString();
                                String direction = platform1Direction.getProperty( "direction" ).toString();
                                route.add( new Stop( stationName, lineName, direction ) );
                            }
                        }
                    }
                    tx.success();
                    long end = System.currentTimeMillis();

                    System.out.println("From: " + from + ", To: " + to);

                    Sequence<Stop> routeSeq = sequence( route );

                    if(routeSeq.size() == 0) {
                        System.out.println("No route found");
                    } else
                    {
                        String line = null;
                        for ( Stop stop : routeSeq )
                        {
                            if(line == null) {
                                System.out.print( stop.line + " " + stop.direction + " to " );
                                line = stop.line;
                            }

                            if(!stop.line.equals( line )) {
                                System.out.println(stop.station);
                                System.out.print(stop.line + " " + stop.direction + " to ");
                                line = stop.line;
                            }
                        }
                        Stop lastStop = routeSeq.last();
                        System.out.println( lastStop.station);
                        System.out.println("Time to calculate: " + (end - start));
                    }

                    System.out.println("-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-");
                }

            }
        }
    }

    private static PathExpander skipSomeConnections()
    {
        StandardExpander expander = StandardExpander.create(
                withName( "AT" ), Direction.BOTH,
                withName( "TRAIN" ), OUTGOING,
                withName( "WAIT" ), OUTGOING )
                .addNodeFilter( new Predicate<Node>()
                {
                    @Override
                    public boolean accept( Node item )
                    {
                        if(item.hasLabel( IN_PLATFORM ) || item.hasLabel( OUT_PLATFORM )) {
                            Node station = item.getSingleRelationship( AT, OUTGOING).getEndNode();
                            String stationName = station.getProperty( "stationName" ).toString();
                            return !stationName.startsWith( "B" );
                        }
                        else
                        {
                            return true;
                        }
                    }
                } );

        return StandardExpander.toPathExpander( expander );
    }

    private static PathExpander allConnections()
    {
        StandardExpander expander = StandardExpander.create(
                withName( "AT" ), Direction.BOTH,
                withName( "TRAIN" ), OUTGOING,
                withName( "WAIT" ), OUTGOING );
        return StandardExpander.toPathExpander( expander );
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
        return new CostEvaluator<Double>() {
            @Override
            public Double getCost(Relationship relationship, Direction direction) {
                if (relationship.getType().name().equals("AT")) {
                    return 1.0;
                }
                return ((double) relationship.getProperty("runningTime"));
            }
        };
    }

    static class Stop {
        private String station;
        private String line;
        private String direction;

        Stop(String station, String line, String direction) {

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

    private static class NaiveEstimateEvaluator implements EstimateEvaluator<Double>
    {
        @Override
        public Double getCost( Node node, Node goal )
        {
            return 1.0;
        }
    }
}

