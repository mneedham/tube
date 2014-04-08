package org.neo4j.tube;

import java.util.List;

public class TubeSearchResult
{

    private List<Instruction> instructions;

    public TubeSearchResult( List<Instruction> instructions )
    {
        this.instructions = instructions;
    }

    public List<Instruction> getInstructions()
    {
        return instructions;
    }
}
