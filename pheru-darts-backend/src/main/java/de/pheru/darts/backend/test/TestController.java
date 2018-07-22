package de.pheru.darts.backend.test;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.model.*;
import de.pheru.darts.backend.dtos.UserDto;
import de.pheru.darts.backend.entities.GameEntity;
import de.pheru.darts.backend.entities.PlayerPermissionEntity;
import de.pheru.darts.backend.entities.UserEntity;
import de.pheru.darts.backend.repositories.GamesRepository;
import de.pheru.darts.backend.repositories.PlayerPermissionRepository;
import de.pheru.darts.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class TestController { //TODO Entfernen

    private final UserRepository userRepository;
    private final PlayerPermissionRepository playerPermissionRepository;
    private final GamesRepository gamesRepository;

    public TestController(final UserRepository userRepository, final PlayerPermissionRepository playerPermissionRepository, final GamesRepository gamesRepository) {
        this.userRepository = userRepository;
        this.playerPermissionRepository = playerPermissionRepository;
        this.gamesRepository = gamesRepository;
    }

    @RequestMapping("/testfehler")
    public UserDto testfehler() {
        System.out.println("Testfehler aufgerufen");
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("return Exception mit message \"Ich bin ein Fehler\"");
        throw new RuntimeException("Ich bin ein Fehler");
    }

    @PostMapping("/admin/db/clear")
    public void clearDBs() {
        System.out.println("Clear DBs");
        userRepository.deleteAll();
        playerPermissionRepository.deleteAll();
        gamesRepository.deleteAll();
        System.out.println("Clear DBs fertig");
    }

    @Autowired
    private AmazonDynamoDB amazonDynamoDB;

    @EventListener(ApplicationReadyEvent.class)
    public void dbInit() {
        System.out.println("DB Init");

//        deleteTableUser();
//        createTableUser();

//        deleteTablePermission();
//        createTablePermission();

//        deleteTableGames();
//        createTableGames();

        System.out.println("DB Ende");
    }

    private void createTableUser() {
        System.out.println("Create Table User");

        final DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(amazonDynamoDB);
        final CreateTableRequest tableRequest = dynamoDBMapper.generateCreateTableRequest(UserEntity.class);
        tableRequest.setProvisionedThroughput(new ProvisionedThroughput(1L, 1L));
        tableRequest.getGlobalSecondaryIndexes().get(0).setProvisionedThroughput(new ProvisionedThroughput(1L, 1L));
        final Projection projection = new Projection();
        projection.setProjectionType(ProjectionType.ALL);
        tableRequest.getGlobalSecondaryIndexes().get(0).setProjection(projection);
        amazonDynamoDB.createTable(tableRequest);

        System.out.println("Create Table Ende");
    }

    private void createTablePermission() {
        System.out.println("Create Table PlayerPermission");

        final DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(amazonDynamoDB);
        final CreateTableRequest tableRequest = dynamoDBMapper.generateCreateTableRequest(PlayerPermissionEntity.class);
        tableRequest.setProvisionedThroughput(new ProvisionedThroughput(1L, 1L));
        tableRequest.getGlobalSecondaryIndexes().get(0).setProvisionedThroughput(new ProvisionedThroughput(1L, 1L));
        Projection projection = new Projection();
        projection.setProjectionType(ProjectionType.ALL);
        tableRequest.getGlobalSecondaryIndexes().get(0).setProjection(projection);
        tableRequest.getGlobalSecondaryIndexes().get(1).setProvisionedThroughput(new ProvisionedThroughput(1L, 1L));
        projection = new Projection();
        projection.setProjectionType(ProjectionType.ALL);
        tableRequest.getGlobalSecondaryIndexes().get(1).setProjection(projection);
        amazonDynamoDB.createTable(tableRequest);

        System.out.println("Create Table Ende");
    }

    private void createTableGames() {
        System.out.println("Create Table Games");

        final DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(amazonDynamoDB);
        final CreateTableRequest tableRequest = dynamoDBMapper.generateCreateTableRequest(GameEntity.class);
        tableRequest.setProvisionedThroughput(new ProvisionedThroughput(1L, 1L));
        tableRequest.getGlobalSecondaryIndexes().get(0).setProvisionedThroughput(new ProvisionedThroughput(1L, 1L));
        final Projection projection = new Projection();
        projection.setProjectionType(ProjectionType.ALL);
        tableRequest.getGlobalSecondaryIndexes().get(0).setProjection(projection);
        amazonDynamoDB.createTable(tableRequest);

        System.out.println("Create Table Ende");
    }

    private void deleteTableUser() {
        System.out.println("Delete Table User");

        final DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(amazonDynamoDB);
        final DeleteTableRequest tableRequest = dynamoDBMapper.generateDeleteTableRequest(UserEntity.class);
        amazonDynamoDB.deleteTable(tableRequest);

        System.out.println("Delete Table Ende");
    }

    private void deleteTablePermission() {
        System.out.println("Delete Table PlayerPermission");

        final DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(amazonDynamoDB);
        final DeleteTableRequest tableRequest = dynamoDBMapper.generateDeleteTableRequest(PlayerPermissionEntity.class);
        amazonDynamoDB.deleteTable(tableRequest);

        System.out.println("Delete Table Ende");
    }

    private void deleteTableGames() {
        System.out.println("Delete Table Game");

        final DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(amazonDynamoDB);
        final DeleteTableRequest tableRequest = dynamoDBMapper.generateDeleteTableRequest(GameEntity.class);
        amazonDynamoDB.deleteTable(tableRequest);

        System.out.println("Delete Table Ende");
    }
}
