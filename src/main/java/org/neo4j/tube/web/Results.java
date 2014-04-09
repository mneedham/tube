package org.neo4j.tube.web;

import java.util.List;

import com.google.common.base.Optional;

import org.neo4j.tube.Instruction;
import org.neo4j.tube.TubeSearchResult;

public class Results
{
    private String fromStation;
    private String toStation;
    private TubeSearchResult tubeSearchResult;

    public Results( String fromStation, String toStation, TubeSearchResult tubeSearchResult )
    {
        this.fromStation = fromStation;
        this.toStation = toStation;
        this.tubeSearchResult = tubeSearchResult;
    }

    public String getFromStation()
    {
        return fromStation;
    }

    public String getToStation()
    {
        return toStation;
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
