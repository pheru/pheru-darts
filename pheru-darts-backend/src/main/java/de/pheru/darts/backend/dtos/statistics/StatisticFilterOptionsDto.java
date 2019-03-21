package de.pheru.darts.backend.dtos.statistics;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class StatisticFilterOptionsDto {

    private Map<String, Set<String>> usernameToUserIds;
    private List<String> comparativeOperators;
    private List<StatisticFilterGameOptionDto> games;

    public Map<String, Set<String>> getUsernameToUserIds() {
        return usernameToUserIds;
    }

    public void setUsernameToUserIds(final Map<String, Set<String>> usernameToUserIds) {
        this.usernameToUserIds = usernameToUserIds;
    }

    public List<String> getComparativeOperators() {
        return comparativeOperators;
    }

    public void setComparativeOperators(final List<String> comparativeOperators) {
        this.comparativeOperators = comparativeOperators;
    }

    public List<StatisticFilterGameOptionDto> getGames() {
        return games;
    }

    public void setGames(final List<StatisticFilterGameOptionDto> games) {
        this.games = games;
    }
}