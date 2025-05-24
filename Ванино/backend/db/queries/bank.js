const queries = {
    // Branch queries
    createBranch: `
        INSERT INTO branch (name)
        VALUES ($1)
        RETURNING branch_id, name
    `,
    
    getBranches: `
        SELECT branch_id, name
        FROM branch
        ORDER BY name
    `,
    
    // Organization queries
    createOrganization: `
        INSERT INTO organization (name)
        VALUES ($1)
        RETURNING org_id, name
    `,
    
    createOrganizationRev: `
        INSERT INTO organization_rev (org_id, name, inn, kpp, address, valid_from, valid_to)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING rev_id, org_id, name, inn, kpp, address, valid_from, valid_to
    `,
    
    getOrganizations: `
        SELECT o.org_id, o.name, 
               r.name as current_name, r.inn, r.kpp, r.address,
               r.valid_from, r.valid_to
        FROM organization o
        LEFT JOIN organization_rev r ON o.org_id = r.org_id
        WHERE r.valid_to IS NULL OR r.valid_to > CURRENT_DATE
        ORDER BY o.name
    `,
    
    // Organization revision queries
    getOrganizationRevs: `
        SELECT r.rev_id, r.org_id, o.name as org_name, r.name, r.inn, r.kpp, r.address,
               r.valid_from, r.valid_to
        FROM organization_rev r
        JOIN organization o ON r.org_id = o.org_id
        ORDER BY r.valid_from DESC
    `,
    
    getOrganizationRevById: `
        SELECT r.rev_id, r.org_id, o.name as org_name, r.name, r.inn, r.kpp, r.address,
               r.valid_from, r.valid_to
        FROM organization_rev r
        JOIN organization o ON r.org_id = o.org_id
        WHERE r.rev_id = $1
    `,
    
    // Account queries
    createAccount: `
        INSERT INTO account (account_no, org_id)
        VALUES ($1, $2)
        RETURNING account_no, org_id
    `,
    
    getAccounts: `
        SELECT a.account_no, o.name as org_name
        FROM account a
        JOIN organization o ON a.org_id = o.org_id
        ORDER BY a.account_no
    `,
    
    // Purpose queries
    createPurpose: `
        INSERT INTO purpose (account_no, purpose_name)
        VALUES ($1, $2)
        RETURNING purpose_id, account_no, purpose_name
    `,
    
    getPurposes: `
        SELECT p.purpose_id, p.purpose_name, a.account_no, o.name as org_name
        FROM purpose p
        JOIN account a ON p.account_no = a.account_no
        JOIN organization o ON a.org_id = o.org_id
        ORDER BY p.purpose_name
    `,
    
    getPurposeById: `
        SELECT p.purpose_id, p.purpose_name, a.account_no, o.name as org_name
        FROM purpose p
        JOIN account a ON p.account_no = a.account_no
        JOIN organization o ON a.org_id = o.org_id
        WHERE p.purpose_id = $1
    `,
    
    // Payment queries
    createPayment: `
        INSERT INTO payment (pay_date, branch_id, purpose_id, payer_name, amount, org_rev_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING payment_id, pay_date, branch_id, purpose_id, payer_name, amount, org_rev_id
    `,
    
    getPayments: `
        SELECT p.payment_id, p.pay_date, p.payer_name, p.amount,
               b.name as branch_name,
               pur.purpose_name,
               o.name as org_name,
               r.name as org_current_name,
               r.inn, r.kpp, r.address
        FROM payment p
        JOIN branch b ON p.branch_id = b.branch_id
        JOIN purpose pur ON p.purpose_id = pur.purpose_id
        JOIN organization_rev r ON p.org_rev_id = r.rev_id
        JOIN organization o ON r.org_id = o.org_id
        ORDER BY p.pay_date DESC
    `,
    
    getPaymentById: `
        SELECT p.payment_id, p.pay_date, p.payer_name, p.amount,
               b.name as branch_name,
               pur.purpose_name,
               o.name as org_name,
               r.name as org_current_name,
               r.inn, r.kpp, r.address
        FROM payment p
        JOIN branch b ON p.branch_id = b.branch_id
        JOIN purpose pur ON p.purpose_id = pur.purpose_id
        JOIN organization_rev r ON p.org_rev_id = r.rev_id
        JOIN organization o ON r.org_id = o.org_id
        WHERE p.payment_id = $1
    `,
    
    // Additional queries for filtering and searching
    searchPayments: `
        SELECT p.payment_id, p.pay_date, p.payer_name, p.amount,
               b.name as branch_name,
               pur.purpose_name,
               o.name as org_name
        FROM payment p
        JOIN branch b ON p.branch_id = b.branch_id
        JOIN purpose pur ON p.purpose_id = pur.purpose_id
        JOIN organization_rev r ON p.org_rev_id = r.rev_id
        JOIN organization o ON r.org_id = o.org_id
        WHERE 
            (p.pay_date BETWEEN $1 AND $2)
            AND ($3::text IS NULL OR p.payer_name ILIKE '%' || $3 || '%')
            AND ($4::integer IS NULL OR p.branch_id = $4)
            AND ($5::integer IS NULL OR o.org_id = $5)
        ORDER BY p.pay_date DESC
    `,
    
    getOrganizationHistory: `
        SELECT r.rev_id, r.name, r.inn, r.kpp, r.address,
               r.valid_from, r.valid_to
        FROM organization_rev r
        WHERE r.org_id = $1
        ORDER BY r.valid_from DESC
    `
};

module.exports = queries; 