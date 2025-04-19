document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    // Navigation buttons
    document.getElementById('nav-customers').addEventListener('click', (e) => {
        e.preventDefault();
        loadCustomers();
    });

    document.getElementById('nav-policies').addEventListener('click', (e) => {
        e.preventDefault();
        loadPolicies();
    });

    document.getElementById('nav-claims').addEventListener('click', (e) => {
        e.preventDefault();
        loadClaims();
    });

    document.getElementById('nav-payments').addEventListener('click', (e) => {
        e.preventDefault();
        loadPayments();
    });

    document.getElementById('nav-agents').addEventListener('click', (e) => {
        e.preventDefault();
        loadAgents();
    });

    // Load customers by default
    // loadCustomers();

    function showMessage(message, isError = false) {
        const msgDiv = document.getElementById('message');
        if (msgDiv) {
            msgDiv.textContent = message;
            msgDiv.style.color = isError ? 'red' : 'green';
        }
    }

    // Fetch and display customers
    function loadCustomers() {
        fetch('api.php?action=get_customers')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderCustomers(data.customers);
                } else {
                    contentArea.innerHTML = '<p>Error loading customers.</p>';
                }
            })
            .catch(() => {
                contentArea.innerHTML = '<p>Error loading customers.</p>';
            });
    }

    function renderCustomers(customers) {
        let html = "";
        html += "<h2>Customers</h2>";
        html += '<button id="add-customer-btn">Add Customer</button>';
        html += '<div id="message"></div>';
        html += '<table><thead><tr><th>ID</th><th>Name</th><th>DOB</th><th>Email</th><th>Phone</th><th>Address</th><th>Registration Date</th><th>Actions</th></tr></thead><tbody>';
        customers.forEach(c => {
            html += "<tr>";
            html += "<td>" + c.customer_id + "</td>";
            html += "<td>" + c.name + "</td>";
            html += "<td>" + c.dob + "</td>";
            html += "<td>" + c.email + "</td>";
            html += "<td>" + c.phone + "</td>";
            html += "<td>" + c.address + "</td>";
            html += "<td>" + c.registration_date + "</td>";
            html += '<td><button class="edit-customer" data-id="' + c.customer_id + '">Edit</button> ';
            html += '<button class="delete-customer" data-id="' + c.customer_id + '">Delete</button></td>';
            html += "</tr>";
        });
        html += "</tbody></table><div id='form-area'></div>";
        contentArea.innerHTML = html;

        document.getElementById('add-customer-btn').addEventListener('click', () => {
            showCustomerForm();
        });

        document.querySelectorAll('.edit-customer').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const customer = customers.find(c => c.customer_id == id);
                showCustomerForm(customer);
            });
        });

        document.querySelectorAll('.delete-customer').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this customer?')) {
                    deleteCustomer(id);
                }
            });
        });
    }

    function showCustomerForm(customer = null) {
        const formArea = document.getElementById('form-area');
        const isEdit = customer !== null;
        formArea.innerHTML = "";
        formArea.innerHTML += "<h3>" + (isEdit ? "Edit" : "Add") + " Customer</h3>";
        formArea.innerHTML += '<form id="customer-form">';
        formArea.innerHTML += '<label for="name">Name:</label>';
        formArea.innerHTML += '<input type="text" id="name" name="name" required value="' + (isEdit ? customer.name : '') + '" />';
        formArea.innerHTML += '<label for="dob">Date of Birth:</label>';
        formArea.innerHTML += '<input type="date" id="dob" name="dob" required value="' + (isEdit ? customer.dob : '') + '" />';
        formArea.innerHTML += '<label for="email">Email:</label>';
        formArea.innerHTML += '<input type="email" id="email" name="email" required value="' + (isEdit ? customer.email : '') + '" />';
        formArea.innerHTML += '<label for="phone">Phone:</label>';
        formArea.innerHTML += '<input type="text" id="phone" name="phone" required value="' + (isEdit ? customer.phone : '') + '" />';
        formArea.innerHTML += '<label for="address">Address:</label>';
        formArea.innerHTML += '<input type="text" id="address" name="address" required value="' + (isEdit ? customer.address : '') + '" />';
        formArea.innerHTML += '<label for="registration_date">Registration Date:</label>';
        formArea.innerHTML += '<input type="date" id="registration_date" name="registration_date" required value="' + (isEdit ? customer.registration_date : '') + '" />';
        formArea.innerHTML += '<button type="submit">' + (isEdit ? "Update" : "Add") + '</button>';
        formArea.innerHTML += '<button type="button" id="cancel-btn">Cancel</button>';
        formArea.innerHTML += '</form>';

        document.getElementById('customer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};
            formData.forEach((value, key) => data[key] = value);
            if (isEdit) {
                data.customer_id = customer.customer_id;
                updateCustomer(data);
            } else {
                addCustomer(data);
            }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            formArea.innerHTML = '';
        });
    }

    function addCustomer(data) {
        fetch('api.php?action=add_customer', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Customer added successfully');
                loadCustomers();
            } else {
                showMessage('Error adding customer: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error adding customer', true));
    }

    function updateCustomer(data) {
        fetch('api.php?action=update_customer', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Customer updated successfully');
                loadCustomers();
            } else {
                showMessage('Error updating customer: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error updating customer', true));
    }

    function deleteCustomer(id) {
        fetch('api.php?action=delete_customer', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({customer_id: id})
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Customer deleted successfully');
                loadCustomers();
            } else {
                showMessage('Error deleting customer: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error deleting customer', true));
    }

    // Similar functions for policies, claims, payments, agents will be added here...

    // Placeholder functions for other entities
    function loadPolicies() {
        fetch('api.php?action=get_policies')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderPolicies(data.policies);
                } else {
                    contentArea.innerHTML = '<p>Error loading policies.</p>';
                }
            })
            .catch(() => {
                contentArea.innerHTML = '<p>Error loading policies.</p>';
            });
    }

    function renderPolicies(policies) {
        let html = "";
        html += "<h2>Insurance Policies</h2>";
        html += '<button id="add-policy-btn">Add Policy</button>';
        html += '<div id="message"></div>';
        html += '<table><thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Premium</th><th>Coverage</th><th>Duration (yrs)</th><th>Actions</th></tr></thead><tbody>';
        policies.forEach(p => {
            html += "<tr>";
            html += "<td>" + p.policy_id + "</td>";
            html += "<td>" + p.policy_name + "</td>";
            html += "<td>" + p.policy_type + "</td>";
            html += "<td>" + p.premium_amount + "</td>";
            html += "<td>" + p.coverage_amount + "</td>";
            html += "<td>" + p.duration_yrs + "</td>";
            html += '<td><button class="edit-policy" data-id="' + p.policy_id + '">Edit</button> ';
            html += '<button class="delete-policy" data-id="' + p.policy_id + '">Delete</button></td>';
            html += "</tr>";
        });
        html += "</tbody></table><div id='form-area'></div>";
        contentArea.innerHTML = html;

        document.getElementById('add-policy-btn').addEventListener('click', () => {
            showPolicyForm();
        });

        document.querySelectorAll('.edit-policy').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const policy = policies.find(p => p.policy_id == id);
                showPolicyForm(policy);
            });
        });

        document.querySelectorAll('.delete-policy').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this policy?')) {
                    deletePolicy(id);
                }
            });
        });
    }

    function showPolicyForm(policy = null) {
        const formArea = document.getElementById('form-area');
        const isEdit = policy !== null;
        formArea.innerHTML = "";
        formArea.innerHTML += "<h3>" + (isEdit ? "Edit" : "Add") + " Policy</h3>";
        formArea.innerHTML += '<form id="policy-form">';
        formArea.innerHTML += '<label for="policy_name">Name:</label>';
        formArea.innerHTML += '<input type="text" id="policy_name" name="policy_name" required value="' + (isEdit ? policy.policy_name : '') + '" />';
        formArea.innerHTML += '<label for="policy_type">Type:</label>';
        formArea.innerHTML += '<input type="text" id="policy_type" name="policy_type" required value="' + (isEdit ? policy.policy_type : '') + '" />';
        formArea.innerHTML += '<label for="premium_amount">Premium Amount:</label>';
        formArea.innerHTML += '<input type="number" id="premium_amount" name="premium_amount" required value="' + (isEdit ? policy.premium_amount : '') + '" />';
        formArea.innerHTML += '<label for="coverage_amount">Coverage Amount:</label>';
        formArea.innerHTML += '<input type="number" id="coverage_amount" name="coverage_amount" required value="' + (isEdit ? policy.coverage_amount : '') + '" />';
        formArea.innerHTML += '<label for="duration_yrs">Duration (years):</label>';
        formArea.innerHTML += '<input type="number" id="duration_yrs" name="duration_yrs" required value="' + (isEdit ? policy.duration_yrs : '') + '" />';
        formArea.innerHTML += '<button type="submit">' + (isEdit ? "Update" : "Add") + '</button>';
        formArea.innerHTML += '<button type="button" id="cancel-btn">Cancel</button>';
        formArea.innerHTML += '</form>';

        document.getElementById('policy-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};
            formData.forEach((value, key) => data[key] = value);
            if (isEdit) {
                data.policy_id = policy.policy_id;
                updatePolicy(data);
            } else {
                addPolicy(data);
            }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            formArea.innerHTML = '';
        });
    }

    function addPolicy(data) {
        fetch('api.php?action=add_policy', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Policy added successfully');
                loadPolicies();
            } else {
                showMessage('Error adding policy: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error adding policy', true));
    }

    function updatePolicy(data) {
        fetch('api.php?action=update_policy', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Policy updated successfully');
                loadPolicies();
            } else {
                showMessage('Error updating policy: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error updating policy', true));
    }

    function deletePolicy(id) {
        fetch('api.php?action=delete_policy', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({policy_id: id})
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Policy deleted successfully');
                loadPolicies();
            } else {
                showMessage('Error deleting policy: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error deleting policy', true));
    }

    function loadClaims() {
        fetch('api.php?action=get_claims')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderClaims(data.claims);
                } else {
                    contentArea.innerHTML = '<p>Error loading claims.</p>';
                }
            })
            .catch(() => {
                contentArea.innerHTML = '<p>Error loading claims.</p>';
            });
    }

    function renderClaims(claims) {
        let html = "";
        html += "<h2>Claims</h2>";
        html += '<button id="add-claim-btn">Add Claim</button>';
        html += '<div id="message"></div>';
        html += '<table><thead><tr><th>ID</th><th>Customer ID</th><th>Policy ID</th><th>Claim Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
        claims.forEach(c => {
            html += "<tr>";
            html += "<td>" + c.claim_id + "</td>";
            html += "<td>" + c.customer_id + "</td>";
            html += "<td>" + c.policy_id + "</td>";
            html += "<td>" + c.claim_date + "</td>";
            html += "<td>" + c.claim_amount + "</td>";
            html += "<td>" + c.claim_status + "</td>";
            html += '<td><button class="edit-claim" data-id="' + c.claim_id + '">Edit</button> ';
            html += '<button class="delete-claim" data-id="' + c.claim_id + '">Delete</button></td>';
            html += "</tr>";
        });
        html += "</tbody></table><div id='form-area'></div>";
        contentArea.innerHTML = html;

        document.getElementById('add-claim-btn').addEventListener('click', () => {
            showClaimForm();
        });

        document.querySelectorAll('.edit-claim').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const claim = claims.find(c => c.claim_id == id);
                showClaimForm(claim);
            });
        });

        document.querySelectorAll('.delete-claim').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this claim?')) {
                    deleteClaim(id);
                }
            });
        });
    }

    function showClaimForm(claim = null) {
        const formArea = document.getElementById('form-area');
        const isEdit = claim !== null;
        formArea.innerHTML = "";
        formArea.innerHTML += "<h3>" + (isEdit ? "Edit" : "Add") + " Claim</h3>";
        formArea.innerHTML += '<form id="claim-form">';
        formArea.innerHTML += '<label for="customer_id">Customer ID:</label>';
        formArea.innerHTML += '<input type="number" id="customer_id" name="customer_id" required value="' + (isEdit ? claim.customer_id : '') + '" />';
        formArea.innerHTML += '<label for="policy_id">Policy ID:</label>';
        formArea.innerHTML += '<input type="number" id="policy_id" name="policy_id" required value="' + (isEdit ? claim.policy_id : '') + '" />';
        formArea.innerHTML += '<label for="claim_date">Claim Date:</label>';
        formArea.innerHTML += '<input type="date" id="claim_date" name="claim_date" required value="' + (isEdit ? claim.claim_date : '') + '" />';
        formArea.innerHTML += '<label for="claim_amount">Claim Amount:</label>';
        formArea.innerHTML += '<input type="number" id="claim_amount" name="claim_amount" required value="' + (isEdit ? claim.claim_amount : '') + '" />';
        formArea.innerHTML += '<label for="claim_status">Claim Status:</label>';
        formArea.innerHTML += '<input type="text" id="claim_status" name="claim_status" required value="' + (isEdit ? claim.claim_status : '') + '" />';
        formArea.innerHTML += '<button type="submit">' + (isEdit ? "Update" : "Add") + '</button>';
        formArea.innerHTML += '<button type="button" id="cancel-btn">Cancel</button>';
        formArea.innerHTML += '</form>';

        document.getElementById('claim-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};
            formData.forEach((value, key) => data[key] = value);
            if (isEdit) {
                data.claim_id = claim.claim_id;
                updateClaim(data);
            } else {
                addClaim(data);
            }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            formArea.innerHTML = '';
        });
    }

    function addClaim(data) {
        fetch('api.php?action=add_claim', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Claim added successfully');
                loadClaims();
            } else {
                showMessage('Error adding claim: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error adding claim', true));
    }

    function updateClaim(data) {
        fetch('api.php?action=update_claim', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Claim updated successfully');
                loadClaims();
            } else {
                showMessage('Error updating claim: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error updating claim', true));
    }

    function deleteClaim(id) {
        fetch('api.php?action=delete_claim', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({claim_id: id})
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Claim deleted successfully');
                loadClaims();
            } else {
                showMessage('Error deleting claim: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error deleting claim', true));
    }

    function loadPayments() {
        fetch('api.php?action=get_payments')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderPayments(data.payments);
                } else {
                    contentArea.innerHTML = '<p>Error loading payments.</p>';
                }
            })
            .catch(() => {
                contentArea.innerHTML = '<p>Error loading payments.</p>';
            });
    }

    function renderPayments(payments) {
        let html = "";
        html += "<h2>Payments</h2>";
        html += '<button id="add-payment-btn">Add Payment</button>';
        html += '<div id="message"></div>';
        html += '<table><thead><tr><th>ID</th><th>Customer ID</th><th>Policy ID</th><th>Payment Date</th><th>Amount</th><th>Payment Method</th><th>Actions</th></tr></thead><tbody>';
        payments.forEach(p => {
            html += "<tr>";
            html += "<td>" + p.payment_id + "</td>";
            html += "<td>" + p.customer_id + "</td>";
            html += "<td>" + p.policy_id + "</td>";
            html += "<td>" + p.payment_date + "</td>";
            html += "<td>" + p.amount + "</td>";
            html += "<td>" + p.payment_method + "</td>";
            html += '<td><button class="edit-payment" data-id="' + p.payment_id + '">Edit</button> ';
            html += '<button class="delete-payment" data-id="' + p.payment_id + '">Delete</button></td>';
            html += "</tr>";
        });
        html += "</tbody></table><div id='form-area'></div>";
        contentArea.innerHTML = html;

        document.getElementById('add-payment-btn').addEventListener('click', () => {
            showPaymentForm();
        });

        document.querySelectorAll('.edit-payment').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const payment = payments.find(p => p.payment_id == id);
                showPaymentForm(payment);
            });
        });

        document.querySelectorAll('.delete-payment').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this payment?')) {
                    deletePayment(id);
                }
            });
        });
    }

    function showPaymentForm(payment = null) {
        const formArea = document.getElementById('form-area');
        const isEdit = payment !== null;
        formArea.innerHTML = "";
        formArea.innerHTML += "<h3>" + (isEdit ? "Edit" : "Add") + " Payment</h3>";
        formArea.innerHTML += '<form id="payment-form">';
        formArea.innerHTML += '<label for="customer_id">Customer ID:</label>';
        formArea.innerHTML += '<input type="number" id="customer_id" name="customer_id" required value="' + (isEdit ? payment.customer_id : '') + '" />';
        formArea.innerHTML += '<label for="policy_id">Policy ID:</label>';
        formArea.innerHTML += '<input type="number" id="policy_id" name="policy_id" required value="' + (isEdit ? payment.policy_id : '') + '" />';
        formArea.innerHTML += '<label for="payment_date">Payment Date:</label>';
        formArea.innerHTML += '<input type="date" id="payment_date" name="payment_date" required value="' + (isEdit ? payment.payment_date : '') + '" />';
        formArea.innerHTML += '<label for="amount">Amount:</label>';
        formArea.innerHTML += '<input type="number" id="amount" name="amount" required value="' + (isEdit ? payment.amount : '') + '" />';
        formArea.innerHTML += '<label for="payment_method">Payment Method:</label>';
        formArea.innerHTML += '<input type="text" id="payment_method" name="payment_method" required value="' + (isEdit ? payment.payment_method : '') + '" />';
        formArea.innerHTML += '<button type="submit">' + (isEdit ? "Update" : "Add") + '</button>';
        formArea.innerHTML += '<button type="button" id="cancel-btn">Cancel</button>';
        formArea.innerHTML += '</form>';

        document.getElementById('payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};
            formData.forEach((value, key) => data[key] = value);
            if (isEdit) {
                data.payment_id = payment.payment_id;
                updatePayment(data);
            } else {
                addPayment(data);
            }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            formArea.innerHTML = '';
        });
    }

    function addPayment(data) {
        fetch('api.php?action=add_payment', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Payment added successfully');
                loadPayments();
            } else {
                showMessage('Error adding payment: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error adding payment', true));
    }

    function updatePayment(data) {
        fetch('api.php?action=update_payment', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Payment updated successfully');
                loadPayments();
            } else {
                showMessage('Error updating payment: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error updating payment', true));
    }

    function deletePayment(id) {
        fetch('api.php?action=delete_payment', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({payment_id: id})
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Payment deleted successfully');
                loadPayments();
            } else {
                showMessage('Error deleting payment: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error deleting payment', true));
    }

    function loadAgents() {
        fetch('api.php?action=get_agents')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderAgents(data.agents);
                } else {
                    contentArea.innerHTML = '<p>Error loading agents.</p>';
                }
            })
            .catch(() => {
                contentArea.innerHTML = '<p>Error loading agents.</p>';
            });
    }

    function renderAgents(agents) {
        let html = "";
        html += "<h2>Agents</h2>";
        html += '<button id="add-agent-btn">Add Agent</button>';
        html += '<div id="message"></div>';
        html += '<table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead><tbody>';
        agents.forEach(a => {
            html += "<tr>";
            html += "<td>" + a.agent_id + "</td>";
            html += "<td>" + a.name + "</td>";
            html += "<td>" + a.email + "</td>";
            html += "<td>" + a.phone + "</td>";
            html += "<td>" + a.address + "</td>";
            html += '<td><button class="edit-agent" data-id="' + a.agent_id + '">Edit</button> ';
            html += '<button class="delete-agent" data-id="' + a.agent_id + '">Delete</button></td>';
            html += "</tr>";
        });
        html += "</tbody></table><div id='form-area'></div>";
        contentArea.innerHTML = html;

        document.getElementById('add-agent-btn').addEventListener('click', () => {
            showAgentForm();
        });

        document.querySelectorAll('.edit-agent').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const agent = agents.find(a => a.agent_id == id);
                showAgentForm(agent);
            });
        });

        document.querySelectorAll('.delete-agent').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this agent?')) {
                    deleteAgent(id);
                }
            });
        });
    }

    function showAgentForm(agent = null) {
        const formArea = document.getElementById('form-area');
        const isEdit = agent !== null;
        formArea.innerHTML = "";
        formArea.innerHTML += "<h3>" + (isEdit ? "Edit" : "Add") + " Agent</h3>";
        formArea.innerHTML += '<form id="agent-form">';
        formArea.innerHTML += '<label for="name">Name:</label>';
        formArea.innerHTML += '<input type="text" id="name" name="name" required value="' + (isEdit ? agent.name : '') + '" />';
        formArea.innerHTML += '<label for="email">Email:</label>';
        formArea.innerHTML += '<input type="email" id="email" name="email" required value="' + (isEdit ? agent.email : '') + '" />';
        formArea.innerHTML += '<label for="phone">Phone:</label>';
        formArea.innerHTML += '<input type="text" id="phone" name="phone" required value="' + (isEdit ? agent.phone : '') + '" />';
        formArea.innerHTML += '<label for="address">Address:</label>';
        formArea.innerHTML += '<input type="text" id="address" name="address" required value="' + (isEdit ? agent.address : '') + '" />';
        formArea.innerHTML += '<button type="submit">' + (isEdit ? "Update" : "Add") + '</button>';
        formArea.innerHTML += '<button type="button" id="cancel-btn">Cancel</button>';
        formArea.innerHTML += '</form>';

        document.getElementById('agent-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};
            formData.forEach((value, key) => data[key] = value);
            if (isEdit) {
                data.agent_id = agent.agent_id;
                updateAgent(data);
            } else {
                addAgent(data);
            }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            formArea.innerHTML = '';
        });
    }

    function addAgent(data) {
        fetch('api.php?action=add_agent', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Agent added successfully');
                loadAgents();
            } else {
                showMessage('Error adding agent: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error adding agent', true));
    }

    function updateAgent(data) {
        fetch('api.php?action=update_agent', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Agent updated successfully');
                loadAgents();
            } else {
                showMessage('Error updating agent: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error updating agent', true));
    }

    function deleteAgent(id) {
        fetch('api.php?action=delete_agent', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({agent_id: id})
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                showMessage('Agent deleted successfully');
                loadAgents();
            } else {
                showMessage('Error deleting agent: ' + res.message, true);
            }
        })
        .catch(() => showMessage('Error deleting agent', true));
    }
});
