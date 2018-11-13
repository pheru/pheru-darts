package de.pheru.darts.backend.mappers;

import de.pheru.darts.backend.dtos.notification.NotificationDto;
import de.pheru.darts.backend.dtos.user.UserDto;
import de.pheru.darts.backend.entities.notification.NotificationEntity;
import de.pheru.darts.backend.entities.playerpermission.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.user.UserEntity;

import java.util.ArrayList;
import java.util.List;

public final class EntityMapper {

    private EntityMapper() {
        //Utility-Klasse
    }

    public static UserDto toUserDto(final UserEntity userEntity) {
        return new UserDto(userEntity.getId(), userEntity.getName());
    }

    public static List<UserDto> toUserDto(final List<UserEntity> userEntities) {
        final List<UserDto> userDtos = new ArrayList<>();
        for (final UserEntity userEntity : userEntities) {
            userDtos.add(toUserDto(userEntity));
        }
        return userDtos;
    }

    public static List<String> toPlayableList(final List<PlayerPermissionEntity> playerPermissionEntities) {
        final List<String> playable = new ArrayList<>();
        for (final PlayerPermissionEntity playerPermissionEntity : playerPermissionEntities) {
            playable.add(playerPermissionEntity.getUserId());
        }
        return playable;
    }

    public static List<String> toPermittedList(final List<PlayerPermissionEntity> playerPermissionEntities) {
        final List<String> permitted = new ArrayList<>();
        for (final PlayerPermissionEntity playerPermissionEntity : playerPermissionEntities) {
            permitted.add(playerPermissionEntity.getPermittedUserId());
        }
        return permitted;
    }

    public static NotificationDto toNotificationDto(final NotificationEntity notificationEntity) {
        final NotificationDto notificationDto = new NotificationDto();
        notificationDto.setId(notificationEntity.getId());
        notificationDto.setMessage(notificationEntity.getMessage());
        notificationDto.setRead(notificationEntity.isRead());
        notificationDto.setTimestamp(notificationEntity.getTimestamp());
        return notificationDto;
    }

    public static List<NotificationDto> toNotificationDto(final List<NotificationEntity> notificationEntities) {
        final List<NotificationDto> notificationDtos = new ArrayList<>();
        for (final NotificationEntity notificationEntity : notificationEntities) {
            notificationDtos.add(toNotificationDto(notificationEntity));
        }
        return notificationDtos;
    }
}