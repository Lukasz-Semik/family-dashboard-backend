// import { createConnection, getRepository } from 'typeorm';

// import { User, Family, Todo } from '../entity';

// const seedDbDevelopment = async () => {
//   const connection = await createConnection();

//   await connection.query(
//     'TRUNCATE TABLE "user", "family", "todo", "shopping_list" RESTART IDENTITY;'
//   );

//   const userRepository = getRepository(User);

//   // Create family head

//   await connection.close();
// };

// seedDbDevelopment();
