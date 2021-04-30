const { json } = require('express');
const knex = require('../database/connection');

// No máximo 5 métodos
// LIST | INDEX listar tudo ou com filtros
// SHOW  listar apenas 1
// CREATE criar 1 ou mais 
// DELETE deletar 1 ou mais
// UPDATE atualizar

class UsersController {
  async list(request, response) {
    try {
      const users = await knex('users').select('*');

      return response.json(users);
    }catch(e) {
      console.log(e);
      
      return response.json({error: 'ocorreu um erro ao consultar usuarios'});
    }
  }
  
  async create(request, response) {
    const {name, phone, email} = request.body;
    
    try {
      const id = await knex.from('user').insert({name, phone, email})[0];
      
      if(!id) {
        throw new Error('erro ao inserir usuario no banco')
      }
      
      return response.json({
        id,
        name, 
        phone, 
        email
      })
    } catch (error) {
      return response.json({error: error.message})
    }
  }
  
  async update(request, response){
    const { id } = request.params
    const {name, phone, email} = request.body;
    
    try{
      const [user] = await knex('users').select('*').where({
        id
      });
      if(!user){
        throw new Error('usuário não encontrado')
      }
      
      const newUser = {

        name: name || user.name,
        phone: phone || user.phone,
        email: email || user.email

      }

      await knex.from('users').where({
        id
      }).update({

        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email

      });

      return response.json({
        message: "atualizado com sucesso"
      });
      
    }catch(error){
      return response.status(404).json({error: error.message})
    }
  }
  
  async show(request,response){
    const { id } = request.params;
    
    try{
      
      const [user] = await knex('users').select('*').where({
        id
      });

      if(!user){
        throw new Error('usuário não encontrado');
      }

      return response.json(user);
      
    }catch(error){

      return response.status(404).json({error: error.message});

    }
  }
  async delete(request, response){
    const { id } = request.params
    
    try{

      const [user] = await knex('users').select('*').where({
        id
      });

      if(!user){
        throw new Error('usuário não encontrado')
      }
      
      await knex.from('users').where({
        id
      }).del();
      
      return response.status(201).send('');
      
    }catch(error){
      return response.status(404).json({error: error.message});
    }
  }
}

module.exports = UsersController;