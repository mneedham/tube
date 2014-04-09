package org.neo4j.tube;

public class Instruction
{
    private final String line;
    private final String direction;
    private final String station;
    private double duration;

    public Instruction( String line, String direction, String station, double duration )
    {
        this.line = line;
        this.direction = direction;
        this.station = station;
        this.duration = duration;
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

    public int getDuration()
    {
        return (int) duration;
    }

    @Override
    public String toString()
    {
        return String.format( "%s %s to %s", line, direction, station );
    }

    @Override
    public boolean equals( Object o )
    {
        if ( this == o )
        {
            return true;
        }
        if ( o == null || getClass() != o.getClass() )
        {
            return false;
        }

        Instruction that = (Instruction) o;

        return Double.compare( that.duration, duration ) == 0 && !(direction != null ? !direction.equals( that
                .direction ) : that.direction != null) && !(line != null ? !line.equals( that.line ) : that.line !=
                null) && !(station != null ? !station.equals( that.station ) : that.station != null);

    }

    @Override
    public int hashCode()
    {
        int result;
        long temp;
        result = line != null ? line.hashCode() : 0;
        result = 31 * result + (direction != null ? direction.hashCode() : 0);
        result = 31 * result + (station != null ? station.hashCode() : 0);
        temp = Double.doubleToLongBits( duration );
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        return result;
    }
}
