package de.pheru.darts.backend.controllers;

import de.pheru.darts.backend.dtos.game.*;
import de.pheru.darts.backend.entities.game.*;
import de.pheru.darts.backend.entities.notification.NotificationEntity;
import de.pheru.darts.backend.entities.notification.NotificationType;
import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import de.pheru.darts.backend.exceptions.ForbiddenException;
import org.junit.Before;
import org.junit.Test;

import java.util.Date;
import java.util.List;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.*;

public class GameControllerTest extends ControllerTest {

    private static final String ID_2 = "id-2";
    private static final String CHECKOUT_IN = "SINGLE_IN";
    private static final String CHECKOUT_MODE = "DOUBLE_OUT";
    private static final int SCORE = 501;

    private GameController gameController;

    @Before
    public void setUp() {
        gameController = new GameController(playerPermissionRepository, gamesRepository, userRepository, notificationRepository);

        createAndSaveDefaultLoginUser();
    }

    @Test
    public void postGame() {
        final PlayerPermissionEntity permission2L = createPlayerPermissionEntity(ID_2, LOGIN_ID);
        playerPermissionRepository.save(permission2L);

        final Iterable<GameEntity> allBeforeSave = gamesRepository.findAll();
        assertFalse(allBeforeSave.iterator().hasNext());
        final Iterable<NotificationEntity> allNotificationsBeforeSave = notificationRepository.findAll();
        assertFalse(allNotificationsBeforeSave.iterator().hasNext());

        final GameDto game = createDefaultGame();
        final Date postGameDate = new Date();
        gameController.postGame(game);

        final List<GameEntity> allAfterSave = (List<GameEntity>) gamesRepository.findAll();
        assertEquals(2, allAfterSave.size());
        final List<NotificationEntity> allNotificationsAfterSave = (List<NotificationEntity>) notificationRepository.findAll();
        assertEquals(1, allNotificationsAfterSave.size());
        assertEquals(NotificationType.GAME_SAVED, allNotificationsAfterSave.get(0).getNotificationType());
        assertEquals(ID_2, allNotificationsAfterSave.get(0).getUserId());
        assertTrue(allNotificationsAfterSave.get(0).getMessage().contains(LOGIN_NAME));

        final GameEntity savedGame = allAfterSave.get(0);
        assertEquals(LOGIN_ID, savedGame.getUserId());
        assertEquals(CheckOutMode.DOUBLE_OUT, savedGame.getCheckOutMode());
        assertEquals(CheckInMode.SINGLE_IN, savedGame.getCheckInModeOrDefault());
        assertEquals(game.getScore(), savedGame.getScore());
        assertTrue(savedGame.getTimestamp() >= postGameDate.getTime()
                && savedGame.getTimestamp() < postGameDate.getTime() + 100);
        assertEquals(game.getPlayers().length, savedGame.getPlayers().size());
        assertEquals(game.getPlayers()[1].getId(), savedGame.getPlayers().get(1).getId());
        assertEquals(game.getPlayers()[0].getAufnahmen().length, savedGame.getPlayers().get(0).getAufnahmen().size());

        assertEquals(ID_2, allAfterSave.get(1).getUserId());

        final DartDto[] aufnahme = game.getPlayers()[0].getAufnahmen()[1];
        final AufnahmeDocument savedAufnahme = savedGame.getPlayers().get(0).getAufnahmen().get(1);
        assertEquals(aufnahme[1].getValue(), savedAufnahme.getDarts().get(1).getValue());
        assertEquals(aufnahme[1].getMultiplier(), savedAufnahme.getDarts().get(1).getMultiplier());
    }

    @Test
    public void postGameWithoutCheckInMode() {
        final PlayerPermissionEntity permission2L = createPlayerPermissionEntity(ID_2, LOGIN_ID);
        playerPermissionRepository.save(permission2L);

        final Iterable<GameEntity> allBeforeSave = gamesRepository.findAll();
        assertFalse(allBeforeSave.iterator().hasNext());

        final GameDto game = createDefaultGame();
        game.setCheckInMode(null);
        gameController.postGame(game);

        final List<GameEntity> allAfterSave = (List<GameEntity>) gamesRepository.findAll();
        assertEquals(2, allAfterSave.size());

        final GameEntity savedGame = allAfterSave.get(0);
        assertEquals(LOGIN_ID, savedGame.getUserId());
        assertEquals(CheckInMode.defaultValue(), savedGame.getCheckInModeOrDefault());
    }

    @Test
    public void postGameOneUnregisteredPlayer() {
        final Iterable<GameEntity> allBeforeSave = gamesRepository.findAll();
        assertFalse(allBeforeSave.iterator().hasNext());
        final Iterable<NotificationEntity> allNotificationsBeforeSave = notificationRepository.findAll();
        assertFalse(allNotificationsBeforeSave.iterator().hasNext());

        final GameDto game = createDefaultGame();
        game.getPlayers()[1].setId(null);
        gameController.postGame(game);

        final List<GameEntity> allAfterSave = (List<GameEntity>) gamesRepository.findAll();
        assertEquals(1, allAfterSave.size());
        final List<NotificationEntity> allNotificationsAfterSave = (List<NotificationEntity>) notificationRepository.findAll();
        assertTrue(allNotificationsAfterSave.isEmpty());

        final GameEntity savedGame = allAfterSave.get(0);
        assertEquals(LOGIN_ID, savedGame.getUserId());
    }

    @Test
    public void postGameAllUnregisteredPlayers() {
        final Iterable<GameEntity> allBeforeSave = gamesRepository.findAll();
        assertFalse(allBeforeSave.iterator().hasNext());

        final GameDto game = createDefaultGame();
        game.getPlayers()[0].setId(null);
        game.getPlayers()[1].setId(null);
        gameController.postGame(game);

        final List<GameEntity> allAfterSave = (List<GameEntity>) gamesRepository.findAll();
        assertEquals(0, allAfterSave.size());
    }

    @Test
    public void postGameFailedNotAllowed() {
        final GameDto game = createDefaultGame();
        try {
            gameController.postGame(game);
            fail("Exception expected");
        } catch (final ForbiddenException e) {
            final Iterable<GameEntity> all = gamesRepository.findAll();
            assertFalse(all.iterator().hasNext());
        }
    }

    @Test
    public void postGameRemoveEmptyAufnahme() {
        final PlayerPermissionEntity permission2L = createPlayerPermissionEntity(ID_2, LOGIN_ID);
        playerPermissionRepository.save(permission2L);

        final GameDto game = createDefaultGame();
        game.getPlayers()[0].setAufnahmen(new DartDto[][]{
                new DartDto[]{
                        createDart(11, 1),
                        createDart(12, 2),
                        createDart(13, 3)
                },
                new DartDto[0]
        });
        gameController.postGame(game);

        final GameEntity savedGame = gamesRepository.findAll().iterator().next();
        final PlayerDocument player0 = savedGame.getPlayers().get(0);
        assertEquals(1, player0.getAufnahmen().size());
    }

    private PlayerPermissionEntity createPlayerPermissionEntity(final String userId, final String permittedId) {
        final PlayerPermissionEntity playerPermissionEntity = new PlayerPermissionEntity();
        playerPermissionEntity.setUserId(userId);
        playerPermissionEntity.setPermittedUserId(permittedId);
        return playerPermissionEntity;
    }

    private GameDto createDefaultGame() {
        final PlayerDto playerDto1 = createDefaultPlayer(LOGIN_ID, createDefaultAufnahmen1());
        final PlayerDto playerDto2 = createDefaultPlayer(ID_2, createDefaultAufnahmen2());
        return createDefaultGame(playerDto1, playerDto2);
    }

    private PlayerDto createDefaultPlayer(final String id, final DartDto[][] aufnahmen) {
        final PlayerDto playerDto = new PlayerDto();
        playerDto.setId(id);
        playerDto.setAufnahmen(aufnahmen);
        return playerDto;
    }

    private DartDto[][] createDefaultAufnahmen1() {
        return new DartDto[][]{
                new DartDto[]{
                        createDart(1, 1),
                        createDart(2, 2),
                        createDart(3, 3)
                },
                new DartDto[]{
                        createDart(4, 1),
                        createDart(5, 2)
                }
        };
    }

    private DartDto[][] createDefaultAufnahmen2() {
        return new DartDto[][]{
                new DartDto[]{
                        createDart(11, 1),
                        createDart(12, 2),
                        createDart(13, 3)
                }
        };
    }

    private DartDto createDart(final int value, final int multiplier) {
        final DartDto dartDto = new DartDto();
        dartDto.setValue(value);
        dartDto.setMultiplier(multiplier);
        return dartDto;
    }

    private GameDto createDefaultGame(final PlayerDto... players) {
        final GameDto gameDto = new GameDto();
        gameDto.setPlayers(players);
        final CheckOutDto checkOutDto = new CheckOutDto();
        checkOutDto.setKey(CHECKOUT_MODE);
        gameDto.setCheckOutMode(checkOutDto);
        final CheckInDto checkInDto = new CheckInDto();
        checkInDto.setKey(CHECKOUT_IN);
        gameDto.setCheckInMode(checkInDto);
        gameDto.setScore(SCORE);
        return gameDto;
    }
}