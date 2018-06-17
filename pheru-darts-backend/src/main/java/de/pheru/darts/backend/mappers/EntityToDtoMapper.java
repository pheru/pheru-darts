package de.pheru.darts.backend.mappers;

import de.pheru.darts.backend.dtos.UserDto;
import de.pheru.darts.backend.entities.UserEntity;

import java.util.ArrayList;
import java.util.List;

public final class EntityToDtoMapper {

    private EntityToDtoMapper() {
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
}
