package de.pheru.darts.backend.mocks.statistics;

import de.pheru.darts.backend.entities.game.GameEntity;
import de.pheru.darts.backend.statistics.Statistic;
import de.pheru.darts.backend.statistics.StatisticEvaluation;
import de.pheru.darts.backend.statistics.StatisticFilter;

import java.util.List;

public class MockedStatisticEvaluation implements StatisticEvaluation {

    private Statistic evaluationResult;

    @Override
    public Statistic evaluate(final List<GameEntity> games, final StatisticFilter filter) {
        return evaluationResult;
    }

    public void setEvaluationResult(final Statistic evaluationResult) {
        this.evaluationResult = evaluationResult;
    }
}
