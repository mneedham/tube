package tube;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.neo4j.cypher.javacompat.ExecutionEngine;
import org.neo4j.cypher.javacompat.ExecutionResult;
import org.neo4j.graphalgo.CostEvaluator;
import org.neo4j.graphalgo.EstimateEvaluator;
import org.neo4j.graphalgo.GraphAlgoFactory;
import org.neo4j.graphalgo.PathFinder;
import org.neo4j.graphalgo.WeightedPath;
import org.neo4j.graphdb.*;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;
import org.neo4j.kernel.StandardExpander;
import org.neo4j.kernel.impl.util.FileUtils;

import static java.lang.Double.parseDouble;
import static java.util.Arrays.asList;

import static org.neo4j.graphdb.DynamicLabel.label;
import static org.neo4j.graphdb.DynamicRelationshipType.withName;

public class TubeImporter
{
    private static final String STORE_DIR = "/Users/markhneedham/test-bench/databases/003/neo4j-enterprise-2.1.0-M01/data/graph.db";

    public static void main( String[] args ) throws IOException
    {

//        FileUtils.deleteRecursively( new File( STORE_DIR ) );
        GraphDatabaseService db = new GraphDatabaseFactory().newEmbeddedDatabase( STORE_DIR );
        ExecutionEngine executionEngine = new ExecutionEngine( db );

//        executionEngine.execute( "CREATE INDEX on :Station(stationName)" );
//
//        try (
//                Transaction transaction = db.beginTx();
//                BufferedReader reader = new BufferedReader( new FileReader( "runtimes.csv" ) )
//        )
//        {
//            String line;
//            while ((line = reader.readLine()) != null)
//            {
//                String[] row = line.split( "," );
//
//                HashMap<String, Object> params = new HashMap<>();
//                params.put( "lineName", row[0] );
//                params.put( "direction", row[1] );
//                params.put( "startStationName", row[2] );
//                params.put( "destinationStationName", row[3] );
//                params.put( "distance", parseDouble( row[4] ) );
//                params.put( "runningTime", parseDouble( row[5] ) );
//                executionEngine.execute( "MERGE (start:Station { stationName: {startStationName}})" +
//                        "MERGE (destination:Station { stationName: {destinationStationName}})" +
//                        "MERGE (line:Line { lineName: {lineName}})" +
//                        "MERGE (line) -[:DIRECTION]-> (direction:Direction { direction: {direction}})" +
//                        "CREATE (inPlatform:InPlatform)" +
//                        "CREATE (outPlatform:OutPlatform)" +
//                        "CREATE (inPlatform) -[:AT]-> (destination)" +
//                        "CREATE (outPlatform) -[:AT]-> (start)" +
//                        "CREATE (inPlatform) -[:ON]-> (direction)" +
//                        "CREATE (outPlatform) -[:ON]-> (direction)" +
//                        "CREATE (outPlatform) -[r:TRAIN {distance: {distance}, " +
//                        "runningTime: {runningTime}}]-> (inPlatform)", params );
//            }
//
//            executionEngine.execute( "MATCH (station:Station) <-[:AT]- (platformIn:InPlatform)," +
//                    "(station:Station) <-[:AT]- (platformOut:OutPlatform)," +
//                    "(direction:Direction) <-[:ON]- (platformIn:InPlatform)," +
//                    "(direction:Direction) <-[:ON]- (platformOut:OutPlatform)" +
//                    "CREATE (platformIn) -[:WAIT {runningTime: 0.5}]-> (platformOut)" );
//
//            transaction.success();
//        }

        try ( Transaction tx = db.beginTx() )
        {
            ExecutionResult result = executionEngine.execute(
                    "MATCH (startStation:Station { stationName: 'WATERLOO'}), " +
                            "(destinationStation:Station { stationName: 'OVAL'})\n" +
                            "return startStation, destinationStation" );
            Map<String, Object> row = result.iterator().next();
            Node startStation = (Node) row.get( "startStation" );
            Node destinationStation = (Node) row.get( "destinationStation" );

            PathFinder<WeightedPath> shortestPath = GraphAlgoFactory.aStar(StandardExpander.toPathExpander(
                    StandardExpander.create(
                            withName("AT"), Direction.BOTH,
                            withName("TRAIN"), Direction.OUTGOING,
                            withName("WAIT"), Direction.OUTGOING)),
                    new CostEvaluator<Double>() {
                        @Override
                        public Double getCost(Relationship relationship, Direction direction) {
                            if (relationship.getType().name().equals("AT")) {
                                return 1.0;
                            }
                            return ((double) relationship.getProperty("runningTime"));
                        }
                    }, new NaiveEstimateEvaluator());

            long start = System.currentTimeMillis();
            Iterable<WeightedPath> paths = shortestPath.findAllPaths(startStation, destinationStation);
            for ( WeightedPath path : paths )
            {
                System.out.println(path);
                System.out.println( "duration = " + path.weight() );

                System.out.print(startStation.getProperty("stationName"));
                                                
                for ( Node node : path.nodes() )
                {
                    if (node.hasLabel( label("InPlatform") )) {
                        Node station = node.getSingleRelationship(withName("AT"), Direction.OUTGOING).getEndNode();
                        Node direction = node.getSingleRelationship(withName("ON"), Direction.OUTGOING).getEndNode();
                        Node line = direction.getSingleRelationship(withName("DIRECTION"), Direction.INCOMING).getStartNode();
                        System.out.print(" - [" + line.getProperty("lineName") + " " + direction.getProperty("direction") + "] - " + station.getProperty("stationName")) ;
                    }

                    if (node.hasLabel( label("OutPlatform") ))
                    {
                        Node station = node.getSingleRelationship(withName("AT"), Direction.OUTGOING).getEndNode();

                        if(!(station.equals(startStation) || station.equals(destinationStation))) {
                            System.out.print(station.getProperty("stationName"));
                        }
                    }
                }
                System.out.println();
            }
            tx.success();
            long end = System.currentTimeMillis();

            System.out.println(end - start);
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

