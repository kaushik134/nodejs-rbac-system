/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management & RBAC operations
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: Strong@123
 *               role:
 *                 type: string
 *                 example: 691d4ce7e4bb9f349b0e9e9e
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users (search + pagination + isActive filter)
 *     tags: [Users]
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
 *           type: number
 *           default: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *           default: 10
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: List of users returned
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
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
 *               firstName:
 *                 type: string
 *                 example: Alex
 *               lastName:
 *                 type: string
 *                 example: Miller
 *               email:
 *                 type: string
 *                 example: alex@mail.com
 *               role:
 *                 type: string
 *                 example: 691d4f76e4bb9f349b0e9ea1
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Not allowed to change own system role
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Soft delete a user (isActive=false)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: System users cannot be deleted or user trying to delete own account
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/bulk/same:
 *   patch:
 *     summary: Bulk update same value for all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [update]
 *             properties:
 *               update:
 *                 type: object
 *                 example:
 *                   role: "691d4f76e4bb9f349b0e9ea1"
 *     responses:
 *       200:
 *         description: Bulk update completed
 */

/**
 * @swagger
 * /user/bulk/different:
 *   patch:
 *     summary: Bulk update different users with different values
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [updates]
 *             properties:
 *               updates:
 *                 type: array
 *                 example:
 *                   - userId: "691d4f86e4bb9f349b0e9ea4"
 *                     update:
 *                       firstName: "NewName1"
 *                       role: "691d4f76e4bb9f349b0e9ea1"
 *                   - userId: "691d4f96e4bb9f349b0e9ea5"
 *                     update:
 *                       lastName: "NewLast"
 *     responses:
 *       200:
 *         description: Bulk update done
 */
