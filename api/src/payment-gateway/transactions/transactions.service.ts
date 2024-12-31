import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getTransactions(): Promise<Transaction[]> {
    return await this.transactionRepository.find();
  }

  async findOneTransaction(id: number): Promise<Transaction> {
    return await this.transactionRepository.findOneBy({ id: id });
  }

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.save(transaction);
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.save(transaction);
  }

  async deleteTransaction(transaction: Transaction): Promise<Transaction> {
    return await this.transactionRepository.remove(transaction);
  }

  async findByPaymentOrderId(orderId: string): Promise<Transaction> {
    return await this.transactionRepository.findOneBy({ orderId });
  }

  async findByRequestCode(requestCode: string): Promise<Transaction> {
    return await this.transactionRepository.findOneBy({
      requestCode: requestCode,
    });
  }
}
