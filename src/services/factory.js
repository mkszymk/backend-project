import config from "../config/config.js";

let CartManager, ProductManager, UserManager;

switch (config.persistence) {
  case "MONGO":
    const { default: DBCartManager } = await import("./DB/CartManager.db.js");
    const { default: DBProductManager } = await import(
      "./DB/ProductManager.db.js"
    );
    const { default: DBUserManager } = await import("./DB/UserManager.db.js");
    CartManager = DBCartManager;
    ProductManager = DBProductManager;
    UserManager = DBUserManager;
    break;
  case "FS":
    //Actualmente el DAO de FS no es funcional como sí lo es el de Mongo,
    //y como Factory es opcional, igualmente quise dejarlo acá por si en
    //algun momento decido ajustar el DAO de FS para que funcione de la
    //misma forma que el de DB.

    const { default: FSCartManager } = await import("./FS/CartManager.js");
    const { default: FSProductManager } = await import(
      "./FS/ProductManager.js"
    );
    CartManager = FSCartManager;
    ProductManager = FSProductManager;
    break;
}

export { CartManager, ProductManager, UserManager };
