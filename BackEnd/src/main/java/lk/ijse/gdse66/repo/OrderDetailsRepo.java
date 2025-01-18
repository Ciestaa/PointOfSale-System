package lk.ijse.gdse66.repo;

import lk.ijse.gdse66.entity.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;


public interface OrderDetailsRepo extends JpaRepository<OrderDetails, String> {
}