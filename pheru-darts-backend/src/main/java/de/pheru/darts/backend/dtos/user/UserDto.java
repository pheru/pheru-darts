package de.pheru.darts.backend.dtos.user;

public class UserDto {

    private String id;
    private String name;

    public UserDto(){
    }

    public UserDto(final String id, final String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

}
