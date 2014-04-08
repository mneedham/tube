package org.neo4j.tube;

public class Instruction
{
    private final String line;
    private final String direction;
    private final String station;

    public Instruction( String line, String direction, String station )
    {
        this.line = line;
        this.direction = direction;
        this.station = station;
    }

    public String getLine()
    {
        return line;
    }

    public String getDirection()
    {
        return direction;
    }

    public String getStation()
    {
        return station;
    }

    @Override
    public String toString()
    {
        return String.format( "%s %s to %s", line, direction, station );
    }
}
