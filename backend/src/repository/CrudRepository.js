import mongoose from "mongoose";

class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const newDocument = await this.model.create(data);
            return newDocument;
        } catch (error) {
            throw new Error(`Error creating document: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const document = await this.model.findById(id);
            return document;
        } catch (error) {
            throw new Error(`Error finding document with ID ${id}: ${error.message}`);
        }
    }

    async findAll() {
        try {
            const documents = await this.model.find();
            return documents;
        } catch (error) {
            throw new Error(`Error finding all documents: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            const updatedDocument = await this.model.findByIdAndUpdate(id, data, { new: true });
            return updatedDocument;
        } catch (error) {
            throw new Error(`Error updating document with ID ${id}: ${error.message}`);
        }
    }

    async destroy(id) {
        try {
            const result = await this.model.findByIdAndDelete(id);
            return result;
        } catch (error) {
            throw new Error(`Error deleting document with ID ${id}: ${error.message}`);
        }
    }
}

export default CrudRepository;