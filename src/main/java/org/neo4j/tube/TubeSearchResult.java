package org.neo4j.tube;

import java.util.List;

public class TubeSearchResult
{

    private List<String> instructions;
    private List<Instruction> instructions2;

    public TubeSearchResult( List<String> instructions, List<Instruction> instructions2 )
    {
        this.instructions = instructions;
        this.instructions2 = instructions2;
    }

    public List<String> getInstructions()
    {
        return instructions;
    }

    public List<Instruction> getInstructions2()
    {
        return instructions2;
    }
}
