package org.neo4j.tube.web;

import java.util.List;

import com.google.common.base.Optional;

import org.neo4j.tube.Instruction;
import org.neo4j.tube.TubeSearchResult;

public class Results
{
    private Optional<String> fromStation;
    private Optional<String> toStation;
    private TubeSearchResult tubeSearchResult;

    public Results( Optional<String> fromStation, Optional<String> toStation, TubeSearchResult tubeSearchResult )
    {
        this.fromStation = fromStation;
        this.toStation = toStation;
        this.tubeSearchResult = tubeSearchResult;
    }

    public String getFromStation()
    {
        return fromStation.or( "None Specified" );
    }

    public String getToStation()
    {
        return toStation.or( "None Specified" );
    }

    public List<Instruction> getInstructions()
    {
        return tubeSearchResult.getInstructions();
    }

    public double getDuration()
    {
        return tubeSearchResult.getDuration();
    }
}
