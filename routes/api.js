const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/basic-auth');
const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

//prisma middleware to hash user password
prisma.$use(async (params, next) => {
  // Manipulate params here
  if (params.action === 'create' && params.model === 'User') {
    const user = params.args.data;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    params.args.data = user;
  }
  result = await next(params);
  return result;
});

//===================================
//USERS ROUTES//
//===================================
// GET route that will return the currently authenticated user
// along with a 200 HTTP status code.

router.get(
  '/users',
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    try {
      const loggedUser = req.loggedUser;
      const user = await prisma.user.findUnique({
        where: { id: loggedUser.id }
      });
      delete user.password;
      res.json({ user });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(error);
      }
      res.status(404);
    }
  })
);

// POST route that will create a new user, set the Location header to "/",
// and return a 201 HTTP status code and no content.

router.post('/users', asyncHandler(async (req, res, next) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;
    await prisma.user.create({
      data: {
        firstname: firstName,
        lastname: lastName,
        password,
        emailAddress
      }
    });
    res.status(201).end();
  } catch (error) {
    console.error('Global Error ==>', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      if (error.code === 'P2002') {
        res.status(400).json({
          errors: ['An account with the same Email address already exists']
        });
      }
    }
  }
}));

//===================================
//COURSES ROUTE//
//===================================

// Route to get all the courses
router.get(
  '/courses',
  asyncHandler(async (req, res) => {
    try {
      const courses = await prisma.course.findMany({
        include: {
          user: {
            select: {
              firstname: true,
              lastname: true,
            }
          }
        }
      });
      res.json(courses);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  })
);

// route to get specific Courses

router.get(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const params = parseInt(req.params.id);
    try {
      const course = await prisma.course.findUnique({
        where: { id: params },
        include: {
          user: {
            select: {
              firstname: true,
              lastname: true,
            }
          }
        }
      });
      if (course) {
        res.json(course);
      } else {
        throw new Error('The Course you are looking for cannot be found');
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        console.log(error);
      }
      res.status(404).json({ message: error.message });
    }
  })
);

// Route to add a course to the database
router.post(
  '/courses',
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await prisma.course.create({
        data: {
          ...req.body,
          userId: parseInt(req.body.userId)
        }
      });
      res.location(`/courses/${course.id}`);
      res.status(201).end();
    } catch (error) {
      const errors = [];
      if (error instanceof Prisma.PrismaClientValidationError) {
        errors.push('Title and description are required');
        // const errors = error.errors.map((x) => x.message);
        res.status(400).json({ errors });
      } else {
        res.status(422);
      }
    }
  })
);

// Route to update Specific Course
router.put(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    console.log(req.params.id);
    try {
      const course = await prisma.course.findUnique({ where: { id: parseInt(req.params.id) } });
      delete req.body.user;
      if (course) {
        //if the logged user is the owner of the course
        if (req.loggedUser.id === course.userId) {
          await prisma.course.update({
            where: {
              id: parseInt(req.params.id)
            },
            data: { ...req.body }
          });
          res.status(204).end();
        } else {
          res.status(403).json({
            message: 'Unauthorized, This item does not belong to you',
          });
        }
      } else {
        throw new Error(
          'The course you are trying to update doesnt exist anymore'
        );
      }
    } catch (error) {
      const errors = [];
      if (error instanceof Prisma.PrismaClientValidationError) {
        console.log(error);
        errors.push('Title and description are both required');
        // const errors = error.errors.map((x) => x.message);
        res.status(400).json({ errors });
      } else {
        res.status(422);
      }
    }
  })
);

// Route to delete specific Course;
router.delete(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await prisma.course.findUnique({
        where: {
          id: parseInt(req.params.id)
        }
      });
      if (course) {
        if (req.loggedUser.id === course.userId) {
          await prisma.course.delete({
            where: {
              id: parseInt(req.params.id)
            }
          });
          res.status(204).end();
        } else {
          res.status(403).json({
            message: 'Unauthorized, This item does not belong to you',
          });
        }
      } else {
        throw new Error(
          'The course you are trying to delete doesnt exist anymore'
        );
      }
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
