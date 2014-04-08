package org.neo4j.tube;

import java.util.Arrays;
import java.util.List;

import org.junit.Test;

import static com.googlecode.totallylazy.Sequences.sequence;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.junit.Assert.assertThat;

public class TubeSearchTest
{
    @Test
    public void shouldTranslateStopsOnOneLineIntoSingleInstruction()
    {
        // given
        List<Stop> stops = sequence(
                new Stop( "Oval", "Northern", "South", 0.0 ),
                new Stop( "Stockwell", "Northern", "South", 2.0 )
        ).toList();

        // when
        List<Instruction> instructions = TubeSearch.asInstructions( stops );

        // then
        assertThat(instructions, hasItem(new Instruction("Northern", "South", "Stockwell", 2.0)));
    }

    @Test
    public void shouldTranslateAChangeOfLineIntoMultipleInstructions()
    {
        // given
        List<Stop> stops = sequence(
                new Stop( "Brixton", "Victoria", "North", 0.0 ),
                new Stop( "Stockwell", "Victoria", "North", 2.0 ),
                new Stop( "Stockwell", "Northern", "North", 0.0 ),
                new Stop( "Oval", "Northern", "North", 1.5 )
        ).toList();

        // when
        List<Instruction> instructions = TubeSearch.asInstructions( stops );

        // then
        assertThat(instructions, equalTo( Arrays.asList(
                new Instruction( "Victoria", "North", "Stockwell", 2.0 ),
                new Instruction( "Northern", "North", "Oval", 1.5 )
        )));
    }

    @Test
    public void shouldAddUpDurationsOfMultipleStops()
    {
        // given
        List<Stop> stops = sequence(
                new Stop( "Brixton", "Victoria", "North", 0.0 ),
                new Stop( "Stockwell", "Victoria", "North", 2.0 ),
                new Stop( "Stockwell", "Northern", "North", 0.0 ),
                new Stop( "Oval", "Northern", "North", 1.5 ),
                new Stop( "Kennington", "Northern", "North", 1.5 )
        ).toList();

        // when
        List<Instruction> instructions = TubeSearch.asInstructions( stops );

        // then
        assertThat(instructions, equalTo(Arrays.asList(
                new Instruction("Victoria", "North", "Stockwell", 2.0),
                new Instruction("Northern", "North", "Kennington", 3.0)
        )));
    }
}
