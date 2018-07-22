package de.pheru.darts.backend.dtos;

public class GameDto {

    private PlayerDto[] players;
    private int score;
    private CheckOutDto checkOutMode;

    public PlayerDto[] getPlayers() {
        return players;
    }

    public void setPlayers(final PlayerDto[] players) {
        this.players = players;
    }

    public int getScore() {
        return score;
    }

    public void setScore(final int score) {
        this.score = score;
    }

    public CheckOutDto getCheckOutMode() {
        return checkOutMode;
    }

    public void setCheckOutMode(final CheckOutDto checkOutMode) {
        this.checkOutMode = checkOutMode;
    }

}
