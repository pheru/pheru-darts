package de.pheru.darts.backend.test;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.model.*;
import de.pheru.darts.backend.dtos.UserDto;
import de.pheru.darts.backend.entities.UserEntity;
import de.pheru.darts.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class TestController {

    private final UserRepository userRepository;

    public TestController(final UserRepository userRepository) {
        this.userRepository = userRepository;
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

    @Autowired
    private AmazonDynamoDB amazonDynamoDB;

    @EventListener(ApplicationReadyEvent.class)
    public void dbInit() {
        System.out.println("DB Init");

//        deleteTableUser();
//        createTableUser();

        System.out.println("DB Ende");
    }

    private void createTableUser() {
        System.out.println("Create Table User");

        final DynamoDBMapper dynamoDBMapper = new DynamoDBMapper(amazonDynamoDB);
        final CreateTableRequest tableRequest = dynamoDBMapper.generateCreateTableRequest(UserEntity.class);
        tableRequest.setProvisionedThroughput(new ProvisionedThroughput(1L, 1L));
        tableRequest.getGlobalSecondaryIndexes().get(0).setProvisionedThroughput(new ProvisionedThroughput(1L, 1L));
        Projection projection = new Projection();
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
}
