package org.neo4j.tube;

import java.io.IOException;
import java.util.List;

import com.googlecode.totallylazy.Pair;
import com.googlecode.totallylazy.Sequence;

import org.neo4j.graphdb.Direction;
import org.neo4j.graphdb.DynamicLabel;
import org.neo4j.graphdb.DynamicRelationshipType;
import org.neo4j.graphdb.Label;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.PathExpander;
import org.neo4j.helpers.Predicate;
import org.neo4j.kernel.StandardExpander;

import static com.googlecode.totallylazy.Sequences.sequence;

import static org.neo4j.graphdb.Direction.INCOMING;
import static org.neo4j.graphdb.Direction.OUTGOING;
import static org.neo4j.graphdb.DynamicRelationshipType.withName;

public class TubeImporter
{
    private static final String STORE_DIR = "/Users/markneedham/test-bench/databases/005/neo4j-community-2.1.0-M01/data/graph.db";
    private static final Label IN_PLATFORM = DynamicLabel.label( "InPlatform" );
    private static final Label OUT_PLATFORM = DynamicLabel.label( "OutPlatform" );
    private static final DynamicRelationshipType AT = withName( "AT" );

    public static void main( String[] args ) throws IOException
    {
        TubeSearch tubeSearch = new TubeSearch( STORE_DIR );

        Sequence<Pair<String, String>> pairsOfStations = sequence(
//                Pair.pair( "AMERSHAM", "MORDEN" )
//                Pair.pair( "AMERSHAM", "UPMINSTER BRIDGE" ),
                Pair.pair( "OVAL", "HIGH BARNET" )
//                Pair.pair( "PADDINGTON", "SOUTHWARK" )
//                Pair.pair( "HEATHROW 123", "SOUTHWARK" ),
//                Pair.pair( "OVAL", "HEATHROW 123" )
        );

        Sequence<PathExpander> expanders = sequence( allConnections(), avoidStationsBeginningWith( "B" ) );

        for ( Pair<String, String> stations : pairsOfStations )
        {
            for ( PathExpander expander : expanders )
            {
                String from = stations.first();
                String to = stations.second();
                TubeSearchResult tubeSearchResult = tubeSearch.between( from, to, expander );
                List<Instruction> instructions = tubeSearchResult.getInstructions();
                System.out.println("From: " + from + ", To: " + to);
                System.out.println("Duration: " + tubeSearchResult.getDuration());

                if(instructions.size() == 0) {
                    System.out.println("No route found");
                }

                for ( Instruction instruction : instructions )
                {
                    System.out.println(instruction + " -> " + instruction.getDuration());
                }
                System.out.println("***********************************");
            }
        }
    }

    public static PathExpander avoidStationsBeginningWith( final String chars )
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
                            return !stationName.startsWith( chars );
                        }
                        else
                        {
                            return true;
                        }
                    }
                } );

        return StandardExpander.toPathExpander( expander );
    }

    public static PathExpander avoidLine( final String lineToAvoid )
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
                            Node direction = item.getSingleRelationship( withName( "ON" ), OUTGOING ).getEndNode();
                            Node line = direction.getSingleRelationship( withName( "DIRECTION" ), INCOMING ).getStartNode();

                            String lineName = line.getProperty( "lineName" ).toString();
                            return !lineName.contains( lineToAvoid );
                        }
                        else
                        {
                            return true;
                        }
                    }
                } );

        return StandardExpander.toPathExpander( expander );
    }

    public static PathExpander allConnections()
    {
        StandardExpander expander = StandardExpander.create(
                withName( "AT" ), Direction.BOTH,
                withName( "TRAIN" ), OUTGOING,
                withName( "WAIT" ), OUTGOING );
        return StandardExpander.toPathExpander( expander );
    }
}
