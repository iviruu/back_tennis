import Roles from './models/rolesmodel.js';
import Saque from './models/saquesModel.js';
import User from './models/userModel.js';


const insertInitialUserData = async () => {

  const userData = [
    {
      email: 'ismaely@gmail.com',
      password: '$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q', //pass: ismael123
      name: 'Ismael',
      roles: 1
    }, 
    {
      email: 'laura@hotmail.com',
      password: '$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q', //pass: ismael123
      name: 'Laura',
      roles: 1
    },
    {
      email: 'maria@hotmail.com',
      password: '$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q', //pass: ismael123
      name: 'Maria',
      surname: 'kale',
      roles: 1
    },
    {
      email: 'mod@hotmail.com',
      password: '$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q', //pass: ismael123
      name: 'Moderador',
      surname: 'kale',
      roles: 2
    },
    {
      email: 'admin@hotmail.com',
      password: '$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q', //pass: ismael123
      name: 'Admin',
      surname: 'kale',
      roles: 2
    },
    {
      email: 'iv.kok.ru@gmial.com',   
      password: '$2b$10$tXrqo7VdSPCLAsIUhrVsYejYeMt9FLo9J4OchgCKwuDvpeDK6Xf1q', //pass: ismael123 
      name: 'Ivan',
      surname: 'Kok',
      roles: 2
    }
  ];
  // Insertar datos con opción ignoreDuplicates
  // Para actualizar todas las filas: updateOnDuplicate: Object.keys(User.rawAttributes)
  await User.bulkCreate(userData, { ignoreDuplicates: true });

  const saqueData = [ 
    { 
      type_saque: 'Saque izquierda cortado paralelo'
    }, 
    { 
      type_saque: 'Saque izquierda cortado cruzado'
    }, 
    { 
      type_saque: 'Saque izquierda cortado cuerpo'
    },
    { 
      type_saque: 'Saque izquierda liftado paralelo'
    }, 
    { 
      type_saque: 'Saque izquierda liftado cruzado'
    }, 
    { 
      type_saque: 'Saque izquierda liftado cuerpo'
    },
    { 
      type_saque: 'Saque izquierda plano paralelo'
    }, 
    { 
      type_saque: 'Saque izquierda plano cruzado'
    }, 
    { 
      type_saque: 'Saque izquierda plano cuerpo'
    },
    { 
      type_saque: 'Saque derecha cortado paralelo'
    }, 
    { 
      type_saque: 'Saque derecha cortado cruzado'
    }, 
    { 
      type_saque: 'Saque derecha cortado cuerpo'
    },
    { 
      type_saque: 'Saque derecha liftado paralelo'
    }, 
    { 
      type_saque: 'Saque derecha liftado cruzado'
    }, 
    { 
      type_saque: 'Saque derecha liftado cuerpo'
    },
    { 
      type_saque: 'Saque derecha plano paralelo'
    }, 
    { 
      type_saque: 'Saque derecha plano cruzado'
    }, 
    { 
      type_saque: 'Saque derecha plano cuerpo'
    },
  ];

  await Saque.bulkCreate(saqueData, { ignoreDuplicates: true });

  const rolesData = [
    {
      role: 'alumno'
    },
    {
      role: 'profesor'
    }
  ];

  await Roles.bulkCreate(rolesData, { ignoreDuplicates: true });
  
}
export { insertInitialUserData };

