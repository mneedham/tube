package org.neo4j.tube.web;

import java.util.List;

import com.google.common.base.Optional;

public class Results
{
    private Optional<String> fromStation;
    private Optional<String> toStation;
    private List<String> instructions;

    public Results( Optional<String> fromStation, Optional<String> toStation, List<String> instructions )
    {
        this.fromStation = fromStation;
        this.toStation = toStation;
        this.instructions = instructions;
    }

    public String getFromStation()
    {
        return fromStation.or( "None Specified" );
    }

    public String getToStation()
    {
        return toStation.or( "None Specified" );
    }

    public List<String> getInstructions()
    {
        return instructions;
    }
}
