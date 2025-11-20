/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, role]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: MongoDB Role ID
 *     responses:
 *       201:
 *         description: User registered / reactivated successfully
 *       409:
 *         description: Email already exists
 */
 
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and receive JWT tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh access & refresh tokens
 *     description: Generates a new JWT access and refresh token using a valid refresh token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIs..."
 *     responses:
 *       200:
 *         description: New access & refresh tokens generated successfully.
 *       400:
 *         description: Refresh token missing.
 *       401:
 *         description: Invalid or expired refresh token.
 *       403:
 *         description: User or role inactive.
 *       500:
 *         description: Failed to refresh token.
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (invalidate refresh token)
 *     description: Deletes the refresh token from DB and logs out the current session/device.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIs..."
 *     responses:
 *       200:
 *         description: Logged out successfully.
 *       400:
 *         description: Refresh token missing.
 *       404:
 *         description: Already logged out or invalid refresh token.
 *       500:
 *         description: Failed to logout.
 */

/**
 * @swagger
 * /auth/checkAccess:
 *   get:
 *     summary: Check access permissions of the logged-in user
 *     description: >
 *       - If **module** query is provided → returns whether the user has access to that module.  
 *       - If **module** is NOT provided → returns the list of all accessModules assigned to the user.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: module
 *         required: false
 *         schema:
 *           type: string
 *         example: "users"
 *         description: (Optional) Module name to check access for.
 *     responses:
 *       200:
 *         description: Access result or full module list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     module:
 *                       type: string
 *                       nullable: true
 *                       example: "users"
 *                     hasAccess:
 *                       type: boolean
 *                       nullable: true
 *                       example: true
 *                     accessModules:
 *                       type: array
 *                       items:
 *                         type: string
 *                       nullable: true
 *                       example: ["users", "roles", "reports"]
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
