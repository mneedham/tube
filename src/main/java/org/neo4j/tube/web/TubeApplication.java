package org.neo4j.tube.web;

import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;

import org.neo4j.tube.TubeSearch;

public class TubeApplication extends Application<TubeConfiguration>
{
    public static void main(String[] args) throws Exception {
        new TubeApplication().run(args);
    }

    @Override
    public String getName() {
        return "The Tube Graph";
    }

    @Override
    public void initialize(Bootstrap<TubeConfiguration> bootstrap) {
        bootstrap.addBundle(new ViewBundle());
        bootstrap.addBundle(new AssetsBundle("/assets/"));
    }

    @Override
    public void run(TubeConfiguration configuration,Environment environment) {
        TubeSearch tubeSearch = new TubeSearch( "/Users/markneedham/Downloads/neo4j-community-2.1.0-M01/data/graph.db" );

        final TubeResource resource = new TubeResource(
                tubeSearch
        );
        environment.jersey().register(resource);
    }

}
