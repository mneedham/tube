package org.neo4j.tube.web;

import com.google.common.base.Optional;
import io.dropwizard.views.View;

public class ResultsView extends View
{
    private Results results;

    public ResultsView(Results results)
    {
        super("tfl.ftl");
//        super("results.ftl");

        this.results = results;
    }

    public Results getResults()
    {
        return results;
    }
}
