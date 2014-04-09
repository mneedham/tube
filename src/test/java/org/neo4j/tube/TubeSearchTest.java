package org.neo4j.tube;

import java.util.Arrays;
import java.util.List;

import com.googlecode.totallylazy.Callable1;
import com.googlecode.totallylazy.Callable2;
import com.googlecode.totallylazy.Pair;
import com.googlecode.totallylazy.Predicate;
import com.googlecode.totallylazy.Sequence;
import com.googlecode.totallylazy.Sequences;
import com.googlecode.totallylazy.numbers.Numbers;
import org.junit.Test;

import static com.googlecode.totallylazy.Sequences.sequence;
import static com.googlecode.totallylazy.Sequences.takeWhile;
import static com.googlecode.totallylazy.numbers.Numbers.sum;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.junit.Assert.assertEquals;
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

        assertEquals(instructions, TubeSearch.asInstructionsAlt( stops ));
    }

    @Test
    public void shouldHandleChangeOfDirectionOnSameLine()
    {
        // given
        List<Stop> stops = sequence(
                new Stop( "Elephant & Castle", "Northern", "South", 0.0 ),
                new Stop( "Kennington City", "Northern", "South", 2.0 ),
                new Stop( "Kennington CX", "Northern", "North", 0.0 ),
                new Stop( "Waterloo", "Northern", "North", 1.5 )
        ).toList();

        // when
        List<Instruction> instructions = TubeSearch.asInstructions( stops );

        // then
        assertThat(instructions, equalTo( Arrays.asList(
                new Instruction( "Northern", "South", "Stockwell", 2.0 ),
                new Instruction( "Northern", "North", "Oval", 1.5 )
        )));

        assertEquals(instructions, TubeSearch.asInstructionsAlt( stops ));
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
        assertThat(instructions, equalTo( Arrays.asList(
                new Instruction( "Victoria", "North", "Stockwell", 2.0 ),
                new Instruction( "Northern", "North", "Kennington", 3.0 )
        ) ));

        assertEquals(instructions, TubeSearch.asInstructionsAlt( stops ));
    }
}
