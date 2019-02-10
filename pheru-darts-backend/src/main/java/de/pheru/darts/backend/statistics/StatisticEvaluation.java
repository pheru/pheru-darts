package de.pheru.darts.backend.statistics;

import de.pheru.darts.backend.entities.game.GameEntity;

import java.util.List;

public interface StatisticEvaluation {

    Statistic evaluate(final List<GameEntity> games, final StatisticFilter filter);

}