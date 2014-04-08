package org.neo4j.tube;

public class Stop
{
    private String station;
    private String line;
    private String direction;
    private double durationSinceLastStop;

    public Stop( String station, String line, String direction, double durationSinceLastStop )
    {
        this.station = station;
        this.line = line;
        this.direction = direction;
        this.durationSinceLastStop = durationSinceLastStop;
    }

    public String getStation()
    {
        return station;
    }

    public String getLine()
    {
        return line;
    }

    public String getDirection()
    {
        return direction;
    }

    public double getDurationSinceLastStop()
    {
        return durationSinceLastStop;
    }

    @Override
    public String toString()
    {
        return "Stop{" +
                "station='" + station + '\'' +
                ", line='" + line + '\'' +
                ", direction='" + direction + '\'' +
                ", duration=" + durationSinceLastStop +
                '}';
    }
}
