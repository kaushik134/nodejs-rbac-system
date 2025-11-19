/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management & RBAC module
 */

/**
 * @swagger
 * /role:
 *   post:
 *     summary: Create a new role
 *     description: Creates a new RBAC role with assigned modules.
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *               - accessModules
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: "Manager"
 *               accessModules:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["users", "reports"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *       409:
 *         description: Role already exists
 */

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         default: 10
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: List of roles with pagination
 */

/**
 * @swagger
 * /role/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role found
 *       404:
 *         description: Role not found
 */

/**
 * @swagger
 * /role/{id}:
 *   put:
 *     summary: Update a role
 *     description: Update role name or add/remove modules.  
 *                  System roles (Admin / Super Admin) cannot be edited.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: "Updated Manager"
 *               addModule:
 *                 type: string
 *                 example: "analytics"
 *               removeModule:
 *                 type: string
 *                 example: "reports"
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       403:
 *         description: System roles cannot be modified
 *       409:
 *         description: Duplicate role name or module conflict
 */

/**
 * @swagger
 * /role/{id}:
 *   delete:
 *     summary: Delete a role
 *     description: 
 *       - If users are assigned to this role, you must provide transferRoleId  
 *       - System roles (Admin / Super Admin) cannot be deleted
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transferRoleId:
 *                 type: string
 *                 example: "691d4ce7e4bb9f349b0e9e9e"
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       409:
 *         description: Users assigned to this role — transferRoleId required
 *       403:
 *         description: System roles cannot be deleted
 *       404:
 *         description: Role not found
 */
