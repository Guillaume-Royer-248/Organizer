const client = require('../config/db');
const {
  /* eslint-disable no-unused-vars */
  ApiError,
  /* eslint-disable no-unused-vars */
} = require('../errors/apiErrors');

/**
 * @typedef {object} Employee
 * @property {number} id - ID of the user
 * @property {string} reg_number - User code
 * @property {string} name - Employee firstname
 * @property {string} lastname - Employee lastname
 * @property {number} team_id - id of the employee team
 * @property {string} role - role of the user : user/admin
 * @property {string} function - Employee function
 * @property {string} profile_picture - URL of the profile picture
 */

/**
 * @typedef {object} EmployeeWithPassword
 * @property {number} id - ID of the user
 * @property {string} reg_number - User code
 * @property {string} password - Password of the user
 * @property {string} name - Employee firstname
 * @property {string} lastname - Employee lastname
 * @property {number} team_id - Id of the employee team
 * @property {string} role - role of the user : user/admin
 * @property {string} function - Employee function
 * @property {string} profile_picture - URL of the profile picture
 */

/**
 * @typedef {object} Status
 * @property {number} id - ID of the satus
 * @property {string} label - Label of the status
 * @property {string} created_at - Creation date of the status
 * @property {string} upated_at - Update date of the status
 */

/**
 * @typedef {object} Affected_status
 * @property {number} id - ID of the affected Status
 * @property {string} date - Date of the affectation
 * @property {number} employee_id - ID of the employee
 * @property {number} status_id - ID of the status
 * @property {number} team_id - ID of the replacement team
 * @property {string} comment - Comment of the affected status
 */

/**
 * @typedef {object} Shift
 * @property {number} id - ID of the shift
 * @property {string} label - Label of the shift
 * @property {string} date - Date of the shift
 * @property {number} team_id - ID of the team
 */

module.exports = {

  /**
   * Returning all employees without filter or order
   * @returns {Employee[]} - All employees in the database
   */
  async getAllEmployee() {
    const result = await client.query(`
    SELECT 
      employee.id, 
      employee.reg_number, 
      employee.name, 
      employee.lastname,
      team.noun as team_noun, 
      employee.role, 
      employee.function,
      employee.profile_picture 
    FROM 
      employee LEFT JOIN team 
      ON employee.team_id = team.id`);

    return result.rows;
  },

  /**
   * Model used to get all the employee (only used in the hashAllEmployeePassword method)
   * @returns The list of all the employees
   */
  async getAllEmployeeToBeHashed() {
    const result = await client.query(`
    SELECT 
      *
    FROM 
      employee`);

    return result.rows;
  },

  /**
   * Returing one employee selected based on his reg_number
   * @param {string} regNumber - reg_number of the employee
   * @returns { Employee } - The finded employee
   */
  async getOneEmployeeByReg_number(regNumber) {
    const result = await client.query(
      'SELECT * FROM "employee" WHERE "reg_number"= $1',
      [regNumber],
    );

    return result.rows[0];
  },

  /**
   * Returing one employee selected based on his reg_number
   * @param {number} id - ID of the employee
   * @returns { Employee } - The finded employee
   */
  async getOneEmployeeById(id) {
    const result = await client.query(
      `SELECT 
        "employee"."id",
        "employee"."reg_number",
        "employee"."name",
        "employee"."lastname",
        "employee"."password",
        "employee"."role",
        "employee"."function",
        "employee"."profile_picture",
        "employee"."team_id",
        "team"."noun" as "team"
      FROM "employee" 
      LEFT JOIN "team" on "team"."id" = "employee"."team_id"
      WHERE "employee"."id"= $1`,
      [id],
    );

    return result.rows[0];
  },

  /**
   * Adding a new employee in the database
   * @param {string} regNumber - Reg number of the employee
   * @param {string} password - Password of the employee
   * @param {string} role - role of the employee : user/admin
   * @param {string} name - Name of the employee
   * @param {string} lastname - Lastname of the employee
   * @param {string} function - Function of the employee
   * @param {string} profilePicture - Link to the picture/Avatar of the employee
   * @param {number} teamId - ID of the mployee team
   * @returns {object} - New created employee
   */
  async addEmployee(employee) {
    const newEmployee = await client.query(
      `INSERT INTO
        "employee" (
          "reg_number", 
          "password",
          "role", 
          "name", 
          "lastname", 
          "function", 
          "profile_picture", 
          "team_id"
        ) 
        VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8) 
      RETURNING *`,
      [
        employee.regNumber,
        employee.password,
        employee.role,
        employee.name,
        employee.lastname,
        employee.function,
        employee.profilePicture,
        employee.teamId,
      ],
    );
    return newEmployee.rows[0];
  },

  /**
   * Dele an employee based on his ID
   * @param {number} id
   * @returns {boolean} - 200 Return true if done
   */
  async deleteEmployee(id) {
    const result = await client.query(
      'DELETE FROM "employee" WHERE "id"=$1',
      [id],
    );
    return !!result.rowCount;
  },

  /**
   * Returning the status of a dedicated employee on a specific date
   * @param {number} id - ID of the employee
   * @param {string} date - Date of the affected status
   * @returns {Affected_status} - The list of the affected status of the employee for the date
   */
  async getStatusForAnEmployeeForADate(id, date) {
    const result = await client.query(
      'SELECT * FROM "affected_status" WHERE "employee_id"=$1 AND "date" = $2',
      [id, date],
    );
    // console.log("result.rows", result.rows);
    return result.rows;
  },

  /**
   * Find one affected status by his id
   * @param {number} id - Id of the affected status searched
   * @returns {object} The affected status searched
   */
  async getOneAffectedStatusById(id) {
    const result = await client.query(
      `select 
        "affected_status"."id" as "id",
        "affected_status"."date"::date as "date",
        array_agg
              (
              json_build_object(
                'id', "employee"."id",
                'firstName', "employee"."name",
                'lastName', "employee"."lastname")
              ) as employee,
        array_agg
              (
              json_build_object(
                'id', "status"."id",
                'label', "status"."label")
              ) as status,
        array_agg
              (
              json_build_object(
                'id', "team"."id",
                'noun', "team"."noun")
              ) as team,
        "affected_status"."comment" as "comment"
      from "affected_status" 
      left join "employee" on "employee"."id" = "affected_status"."employee_id"
      left join "status" on "status"."id" = "affected_status"."status_id"
      left join "team" on "team"."id" = "affected_status"."team_id"
      where "affected_status"."id" = $1
      group by "affected_status"."id"
      order by "affected_status" ASC`,
      [id],
    );
    return result.rows[0];
  },

  /**
   * Assigns a status to an employee for a date
   * @param {number} id - ID of the employee
   * @param {string} date - Date of the assignement
   * @param {number} statusId - ID of the status to be assigned
   * @param {number} teamId - ID of the replacement team
   * @param {number} comment - Comment of the affected status
   * @returns {Affected_status} - The new affected status registered in the database
   */
  async addStatusToEmployee(id, date, statusId, teamId = null, comment = '') {
    const newStatus = await client.query(
      `INSERT INTO "affected_status" ("employee_id","date","status_id","team_id","comment") VALUES
      ($1,$2,$3,$4,$5) RETURNING *`,
      [
        id,
        date,
        statusId,
        teamId,
        comment,
      ],
    );
    return newStatus.rows[0];
  },

  /**
   * Update the affected_status of an employee for a date
   * @param {number} id - ID of the employee
   * @param {string} date - Date of the assignement
   * @param {number} statusId - ID of the status to be assigned
   * @param {number} teamId - ID of the replacement team
   * @param {number} comment - Comment of the affected status
   * @returns {Affected_status} - The updated affected status in the database
   */
  async updateStatusToEmployee(id, date, statusId, teamId = null, comment = '') {
    const updatedStatus = await client.query(
      `UPDATE "affected_status" SET
        "employee_id" = $1,
        "date" = $2,
        "status_id" = $3,
        "team_id" = $4,
        "comment" = $5
      WHERE "employee_id" = $6 AND "date" = $7`,
      [
        id,
        date,
        statusId,
        teamId,
        comment,
        id,
        date,
      ],
    );
    return updatedStatus.rows[0];
  },

  /**
   * Delete the affected_status of an employee for a date
   * @param {number} id - ID of the employee
   * @param {string} date - Date of the assignement
   */
  async deleteStatusToEmployee(id, date) {
    const result = await client.query(
      'DELETE FROM "affected_status" WHERE "employee_id" = $1 AND "date" = $2',
      [id,
        date,
      ],
    );
    return !!result.rowCount;
  },

  /**
   * Update an employee data
   * @param {object} employee - Employee object
   * @returns - Employee upadted with new data
   */
  async updateEmployee(employee) {
    // console.log('employee', employee);
    const result = await client.query(
      `UPDATE "employee" 
        SET 
          "reg_number" = $1, 
          "name" = $2, 
          "lastname" = $3 , 
          "role" = $4, 
          "password" = $5, 
          "function" = $6, 
          "profile_picture" = $7, 
          "team_id" = $8
        WHERE 
          "id"= $9 ;`,
      [
        employee.reg_number,
        employee.name,
        employee.lastname,
        employee.role,
        employee.password,
        employee.function,
        employee.profile_picture,
        employee.team_id,
        employee.id,
      ],
    );
    return result.rows[0];
  },

  /**
   * Returning all the status
   * @returns {Status} - List of the status
   */
  async getAllStatus() {
    const result = await client.query('SELECT * FROM "status"');
    return result.rows;
  },

  /**
   * Returning one status
   * @param {number} id - ID of the searched status
   * @returns {Status} - Status found
   */
  async getOneStatus(id) {
    const result = await client.query(
      'SELECT * FROM "status" WHERE "id" = $1',
      [id],
    );
    return result.rows[0];
  },
  /**
   * Returns all teams in the database including their members
   * @returns {object} - all teams found
   */
  async getAllTeamWithMembers() {
    const result = await client.query(
      `select 
      "team"."id" as "id",
       "team"."noun" as "team",
       array_agg
        (
        json_build_object(
          'id', "employee"."id",
          'firstName', "employee"."name",
          'lastName', "employee"."lastname")
        ) as employees
      from team
      join employee on employee.team_id = team.id
      Group by team.noun, team.id
      order by "team"."noun"`,
    );

    return result.rows;
  },

  /**
   * Returning all the shifts (used in planning controller)
   * @returns - The list of all the shift present in the database
   */
  async getAllShift() {
    const result = await client.query(
      `SELECT
      "shift"."id",
      "shift"."label",
      "shift"."date"::text,
      "shift"."team_id",
      "team"."noun" as team_name
    FROM
      "shift"
    JOIN "team" ON "shift"."team_id" = "team"."id"
    ORDER BY "shift"."date", "shift"."team_id"`,
    );
    return result.rows;
  },

  /**
   * Returning all the affected status (used in planning controller)
   * @returns - The list of all the affected status in the database
   */
  async getAllAffectedStatus() {
    const result = await client.query(
      `SELECT 
        "affected_status"."id",
        "affected_status"."date"::text, 
        "team"."noun" as replacement_team,
        "employee"."name" as first_name,
        "employee"."lastname" as last_name,
        "employee"."team_id" as team_id,
        "affected_status"."comment" as comment,
        "status"."label" as status
      FROM 
        "affected_status"
      JOIN "status" ON "affected_status"."status_id" = "status"."id"
      JOIN "employee" ON "affected_status"."employee_id" = "employee"."id"
      LEFT JOIN "team" ON "affected_status"."team_id" = "team"."id"`,
    );
    return result.rows;
  },

  /**
   * Add a new shift (used in shift controller)
   * @param {string} date - date of shift
   * @param {number} teamId - Id of team
   * @param {string} label - Label of shift
   * @returns - The new created shift
   */
  async addShift(date, teamId, label) {
    const result = await client.query(
      `INSERT INTO "shift" ("date","team_id","label")
    VALUES
    ($1,$2,$3)`,
      [
        date,
        teamId,
        label,
      ],
    );
    return result.rows[0];
  },

  /**
   * Update a shift (used in shift controller)
   * @param {string} date - date of shift
   * @param {number} teamId - Id of team
   * @param {string} label - Label of shift
   * @returns - The updated shift
   */
  async updateShift(date, teamId, label) {
    const result = await client.query(
      `UPDATE "shift" SET "label" = $3
    WHERE "date" = $1 AND "team_id" = $2`,
      [
        date,
        teamId,
        label,
      ],
    );
    return result.rows[0];
  },

  /**
   * Delete a shift (used in shift controller)
   * @param {string} date - date of shift
   * @returns - validation of the deletion
   */
  async deleteShift(date) {
    const result = await client.query(
      'DELETE FROM "shift" WHERE "date" = $1',
      [
        date,
      ],
    );
    return !!result.rowCount;
  },
};
