package org.neo4j.tube;

public class InstructionBuilder
{

    private String line;
    private String direction;
    private String station;

    public InstructionBuilder line( String line )
    {
        this.line = line;
        return this;
    }

    public InstructionBuilder direction( String direction )
    {
        this.direction = direction;
        return this;
    }

    public InstructionBuilder endStation( String station )
    {
        this.station = station;
        return this;
    }

    public Instruction build() {
        return new Instruction(line, direction, station);
    }
}
