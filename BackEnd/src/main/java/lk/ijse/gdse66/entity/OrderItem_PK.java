package lk.ijse.gdse66.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderItem_PK implements Serializable {
    private String oid;
    private String itemCode;
}