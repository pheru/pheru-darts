package de.pheru.darts.backend.dtos.statistics;

import java.util.List;
import java.util.Map;

public class StatisticFilterOptionsDto {

    private Map<String, List<String>> usernameToUserIds;
    private List<String> comparativeOperators;

    public Map<String, List<String>> getUsernameToUserIds() {
        return usernameToUserIds;
    }

    public void setUsernameToUserIds(final Map<String, List<String>> usernameToUserIds) {
        this.usernameToUserIds = usernameToUserIds;
    }

    public List<String> getComparativeOperators() {
        return comparativeOperators;
    }

    public void setComparativeOperators(final List<String> comparativeOperators) {
        this.comparativeOperators = comparativeOperators;
    }
}
