package org.neo4j.tube.web;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.codahale.metrics.annotation.Timed;

import org.neo4j.tube.TubeSearch;
import org.neo4j.tube.TubeSearchResult;

import static org.neo4j.tube.TubeImporter.allConnections;
import static org.neo4j.tube.TubeImporter.avoidLine;
import static org.neo4j.tube.TubeImporter.avoidStationsBeginningWith;

@Path("/")
@Produces(MediaType.TEXT_HTML)
public class TubeResource {
    private TubeSearch tubeSearch;

    public TubeResource( TubeSearch tubeSearch ) {
        this.tubeSearch = tubeSearch;
    }

    @GET
    @Timed
    public HomeView index() {
        return new HomeView(  );
    }

    @GET
    @Timed
    @Path( "/tube" )
    public ResultsView search(@QueryParam("from") String fromStation, @QueryParam( "to" ) String toStation, @QueryParam( "lineToAvoid" ) String lineToAvoid) {

        TubeSearchResult tubeSearchResult;
        if ( lineToAvoid.equals( "None" ) )
        {
            tubeSearchResult = tubeSearch.between( fromStation, toStation, allConnections() );
        }
        else
        {
            tubeSearchResult = tubeSearch.between( fromStation, toStation, avoidLine( lineToAvoid ) );
        }

        return new ResultsView( new Results(fromStation, toStation, tubeSearchResult));
    }
}
