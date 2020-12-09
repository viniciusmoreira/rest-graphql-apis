const init = connection => {
  const create = async (data) => {
    const conn = await connection;

    const [results] = await conn.query('insert into products (product, price) values (?, ?)', data);

    if(results.affectedRows > 0){
      return findById(results.insertId);
    }

    return {};
  }

  const addImage = async(id, data) => {
    const conn = await connection;

    const [result] = await conn.query(`insert into images (product_id, description, url) values (?, ?, ?)`, [id, ...data]);

    return result.affectedRows > 0;
  }

  const remove = async (id) => {
    const conn = await connection;

    const [results] = await conn.query('delete from products where id = ? limit 1', [id]);

    return results.affectedRows > 0;
  }

  const removeImage = async (productId, id) => {
    const conn = await connection;

    const [results] = await conn.query('delete from images where product_id = ? and id = ?', [productId, id]);

    return results.affectedRows > 0;
  }

  const update = async (id, data) => {
    const conn = await connection;

    const [results] = await conn.query('update products set product = ?, price = ? where id = ?', [...data, id]);

    return results.affectedRows > 0;
  }

  const findImages = async(products, limit = null) => {

    if(products.length === 0){
      return [];
    }
    const conn = await connection;
    const product_ids = products.map(product => product.id).join(',');

    const [images] = await conn.query(`select * from images where product_id in (${product_ids}) ${limit ? 'limit ' + limit : ''}`);

    const mapImages = images.reduce((anterior, atual) => {
      if(!anterior[atual.product_id]){
        anterior[atual.product_id] = []
      }

      return {
        ...anterior,
        [atual.product_id]: [...anterior[atual.product_id], atual]
      }
    }, {});

    return products.map(product => {
      return {
        ...product,
        images: mapImages[product.id] || []
      }
    })
  }

  const findAll = async () => {
    const conn = await connection;

    const [results] = await conn.query('select * from products')

    return findImages(results, 1);
  }

  const findById = async (id) => {
    const conn = await connection;

    const [results] = await conn.query('select * from products where id = ?', id);

    const product = await findImages(results);

    return product[0];
  }

  const updateCategories = async(id, data) => {
    let success = true;
    let results = null;
    const conn = await connection;

    // Controle de transação - Inicio
    await conn.query(`START TRANSACTION`);
    await conn.query(`delete from categories_products where product_id = ?`, [id]);
    
    for await(category of data){
      [results] = await conn.query(`insert into categories_products (product_id, category_id) values (?, ?)`, [id, category])
      if(results.affectedRows === 0) {
        success = false;
        break
      };
    }

    // Controle de transação - Fim
    await conn.query(`COMMIT`); //ROLLBACK

    return success;
  }

  const findAllPaginated = async({ pageSize = 10, page = 1 } = {}) => {
    const conn = await connection;

    const [results] = await conn.query(`select * from products limit ${pageSize+1} offset ${page * pageSize}`);

    const hasNext = results.length > pageSize;

    if(hasNext) results.pop();

    return {
      data: await findImages(results),
      hasNext
    }
  }

  const findAllByCategory = async(data) => {
    const conn = await connection;

    const [results] = await conn.query(`select * from products where id in ( select product_id from categories_products where category_id = ? )`, [data]);

    return findImages(results);
  }
  
  return {
    create,
    addImage,
    update,
    updateCategories,
    remove,
    findAll,
    findById,
    findAllPaginated,
    findAllByCategory,
    removeImage
  }
  
}

module.exports = init;