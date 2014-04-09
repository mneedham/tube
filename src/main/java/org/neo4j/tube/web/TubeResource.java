package org.neo4j.tube.web;

import java.util.List;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Optional;

import org.neo4j.tube.Instruction;
import org.neo4j.tube.TubeSearch;
import org.neo4j.tube.TubeSearchResult;

import static org.neo4j.tube.TubeImporter.allConnections;

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

    @POST
    @Timed
    @Path( "/tube" )
    public ResultsView search(@FormParam("from") String fromStation, @FormParam( "to" ) String toStation) {
        TubeSearchResult tubeSearchResult = tubeSearch.between( fromStation, toStation, allConnections() );
        List<Instruction> instructions = tubeSearchResult.getInstructions();
        return new ResultsView( new Results(fromStation, toStation, tubeSearchResult));
    }
}
