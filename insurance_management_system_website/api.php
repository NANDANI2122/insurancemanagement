<?php
header('Content-Type: application/json');
include 'db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

function respond($success, $data = [], $message = '') {
    echo json_encode(['success' => $success, 'message' => $message] + $data);
    exit;
}

switch ($action) {
    case 'get_customers':
        $result = $GLOBALS['conn']->query("SELECT * FROM customer");
        if ($result) {
            $customers = [];
            while ($row = $result->fetch_assoc()) {
                $customers[] = $row;
            }
            respond(true, ['customers' => $customers]);
        } else {
            respond(false, [], 'Failed to fetch customers');
        }
        break;

    case 'add_customer':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("INSERT INTO customer (name, dob, email, phone, address, registration_date) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $input['name'], $input['dob'], $input['email'], $input['phone'], $input['address'], $input['registration_date']);
        if ($stmt->execute()) {
            respond(true, [], 'Customer added');
        } else {
            respond(false, [], 'Failed to add customer: ' . $stmt->error);
        }
        $stmt->close();
        break;

    case 'update_customer':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['customer_id'])) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("UPDATE customer SET name=?, dob=?, email=?, phone=?, address=?, registration_date=? WHERE customer_id=?");
        $stmt->bind_param("ssssssi", $input['name'], $input['dob'], $input['email'], $input['phone'], $input['address'], $input['registration_date'], $input['customer_id']);
        if ($stmt->execute()) {
            respond(true, [], 'Customer updated');
        } else {
            respond(false, [], 'Failed to update customer: ' . $stmt->error);
        }
        $stmt->close();
        break;

    case 'delete_customer':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['customer_id'])) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("DELETE FROM customer WHERE customer_id=?");
        $stmt->bind_param("i", $input['customer_id']);
        if ($stmt->execute()) {
            respond(true, [], 'Customer deleted');
        } else {
            respond(false, [], 'Failed to delete customer: ' . $stmt->error);
        }
        $stmt->close();
        break;

    // Insurance Policy CRUD
    case 'get_policies':
        $result = $GLOBALS['conn']->query("SELECT * FROM insurance_policy");
        if ($result) {
            $policies = [];
            while ($row = $result->fetch_assoc()) {
                $policies[] = $row;
            }
            respond(true, ['policies' => $policies]);
        } else {
            respond(false, [], 'Failed to fetch policies');
        }
        break;

    case 'add_policy':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("INSERT INTO insurance_policy (policy_name, policy_type, premium_amount, coverage_amount, duration_yrs) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssiii", $input['policy_name'], $input['policy_type'], $input['premium_amount'], $input['coverage_amount'], $input['duration_yrs']);
        if ($stmt->execute()) {
            respond(true, [], 'Policy added');
        } else {
            respond(false, [], 'Failed to add policy: ' . $stmt->error);
        }
        $stmt->close();
        break;

    case 'update_policy':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['policy_id'])) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("UPDATE insurance_policy SET policy_name=?, policy_type=?, premium_amount=?, coverage_amount=?, duration_yrs=? WHERE policy_id=?");
        $stmt->bind_param("ssiiii", $input['policy_name'], $input['policy_type'], $input['premium_amount'], $input['coverage_amount'], $input['duration_yrs'], $input['policy_id']);
        if ($stmt->execute()) {
            respond(true, [], 'Policy updated');
        } else {
            respond(false, [], 'Failed to update policy: ' . $stmt->error);
        }
        $stmt->close();
        break;

    case 'delete_policy':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['policy_id'])) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("DELETE FROM insurance_policy WHERE policy_id=?");
        $stmt->bind_param("i", $input['policy_id']);
        if ($stmt->execute()) {
            respond(true, [], 'Policy deleted');
        } else {
            respond(false, [], 'Failed to delete policy: ' . $stmt->error);
        }
        $stmt->close();
        break;

    // Claims CRUD
    case 'get_claims':
        $result = $GLOBALS['conn']->query("SELECT * FROM claims");
        if ($result) {
            $claims = [];
            while ($row = $result->fetch_assoc()) {
                $claims[] = $row;
            }
            respond(true, ['claims' => $claims]);
        } else {
            respond(false, [], 'Failed to fetch claims');
        }
        break;

    case 'add_claim':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("INSERT INTO claims (customer_id, policy_id, claim_date, claim_amount, claim_status) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisis", $input['customer_id'], $input['policy_id'], $input['claim_date'], $input['claim_amount'], $input['claim_status']);
        if ($stmt->execute()) {
            respond(true, [], 'Claim added');
        } else {
            respond(false, [], 'Failed to add claim: ' . $stmt->error);
        }
        $stmt->close();
        break;

    case 'update_claim':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['claim_id'])) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("UPDATE claims SET customer_id=?, policy_id=?, claim_date=?, claim_amount=?, claim_status=? WHERE claim_id=?");
        $stmt->bind_param("iisisi", $input['customer_id'], $input['policy_id'], $input['claim_date'], $input['claim_amount'], $input['claim_status'], $input['claim_id']);
        if ($stmt->execute()) {
            respond(true, [], 'Claim updated');
        } else {
            respond(false, [], 'Failed to update claim: ' . $stmt->error);
        }
        $stmt->close();
        break;

    case 'delete_claim':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['claim_id'])) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("DELETE FROM claims WHERE claim_id=?");
        $stmt->bind_param("i", $input['claim_id']);
        if ($stmt->execute()) {
            respond(true, [], 'Claim deleted');
        } else {
            respond(false, [], 'Failed to delete claim: ' . $stmt->error);
        }
        $stmt->close();
        break;

    // Payments CRUD
    case 'get_payments':
        $result = $GLOBALS['conn']->query("SELECT * FROM payments");
        if ($result) {
            $payments = [];
            while ($row = $result->fetch_assoc()) {
                $payments[] = $row;
            }
            respond(true, ['payments' => $payments]);
        } else {
            respond(false, [], 'Failed to fetch payments');
        }
        break;

    case 'add_payment':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("INSERT INTO payments (customer_id, policy_id, payment_date, amount, payment_method) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisss", $input['customer_id'], $input['policy_id'], $input['payment_date'], $input['amount'], $input['payment_method']);
        if ($stmt->execute()) {
            respond(true, [], 'Payment added');
        } else {
            respond(false, [], 'Failed to add payment: ' . $stmt->error);
        }
        $stmt->close();
        break;

    case 'update_payment':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['payment_id'])) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("UPDATE payments SET customer_id=?, policy_id=?, payment_date=?, amount=?, payment_method=? WHERE payment_id=?");
        $stmt->bind_param("iisssi", $input['customer_id'], $input['policy_id'], $input['payment_date'], $input['amount'], $input['payment_method'], $input['payment_id']);
        if ($stmt->execute()) {
            respond(true, [], 'Payment updated');
        } else {
            respond(false, [], 'Failed to update payment: ' . $stmt->error);
        }
        $stmt->close();
        break;

    case 'delete_payment':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['payment_id'])) {
            respond(false, [], 'Invalid input');
        }
        $stmt = $GLOBALS['conn']->prepare("DELETE FROM payments WHERE payment_id=?");
        $stmt->bind_param("i", $input['payment_id']);
        if ($stmt->execute()) {
            respond(true, [], 'Payment deleted');
        } else {
            respond(false, [], 'Failed to delete payment: ' . $stmt->error);
        }
        $stmt->close();
        break;

    default:
        respond(false, [], 'Invalid action');
}
?>
