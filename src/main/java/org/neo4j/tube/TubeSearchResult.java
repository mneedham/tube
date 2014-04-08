package org.neo4j.tube;

import java.util.List;

public class TubeSearchResult
{

    private double totalDuration;
    private List<Instruction> instructions;

    public TubeSearchResult( double totalDuration, List<Instruction> instructions )
    {
        this.totalDuration = totalDuration;
        this.instructions = instructions;
    }

    public double getDuration()
    {
        return totalDuration;
    }

    public List<Instruction> getInstructions()
    {
        return instructions;
    }
}
