/**
 * SunuMoto - Wave API Simulator
 * Simule les interactions avec l'API Wave pour les tests
 */

class WaveSimulator {
    constructor() {
        this.transactions = [];
        this.transactionId = 1000;
    }

    /**
     * Simule une demande de paiement Wave
     * @param {number} amount - Montant en FCFA
     * @param {string} phoneNumber - Numéro du conducteur
     * @returns {Promise} Réponse simulée de l'API
     */
    async initiatePayment(amount, phoneNumber) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const transactionId = `TXN_${this.transactionId++}`;
                this.transactions.push({
                    id: transactionId,
                    amount: amount,
                    phone: phoneNumber,
                    status: 'PENDING',
                    timestamp: new Date()
                });

                resolve({
                    success: true,
                    transactionId: transactionId,
                    amount: amount,
                    currency: 'XOF',
                    status: 'PENDING',
                    message: 'Paiement initié. Attendez la confirmation SMS...'
                });
            }, 800);
        });
    }

    /**
     * Confirme un paiement Wave
     * @param {string} transactionId - ID de la transaction
     * @returns {Promise} Confirmation du paiement
     */
    async confirmPayment(transactionId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const transaction = this.transactions.find(t => t.id === transactionId);
                
                if (!transaction) {
                    reject({ error: 'Transaction not found' });
                    return;
                }

                // Simule 95% de succès
                const success = Math.random() < 0.95;
                
                transaction.status = success ? 'COMPLETED' : 'FAILED';
                transaction.completedAt = new Date();

                resolve({
                    success: success,
                    transactionId: transactionId,
                    amount: transaction.amount,
                    status: transaction.status,
                    message: success ? '✅ Paiement confirmé!' : '❌ Paiement échoué'
                });
            }, 1200);
        });
    }

    /**
     * Récupère le statut d'une transaction
     * @param {string} transactionId - ID de la transaction
     * @returns {Object} Statut de la transaction
     */
    getTransactionStatus(transactionId) {
        const transaction = this.transactions.find(t => t.id === transactionId);
        
        if (!transaction) {
            return { error: 'Transaction not found' };
        }

        return {
            transactionId: transaction.id,
            amount: transaction.amount,
            status: transaction.status,
            timestamp: transaction.timestamp.toISOString()
        };
    }

    /**
     * Récupère l'historique des transactions
     * @param {number} limit - Nombre de transactions à retourner
     * @returns {Array} Liste des transactions
     */
    getTransactionHistory(limit = 10) {
        return this.transactions
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit)
            .map(t => ({
                id: t.id,
                amount: t.amount,
                status: t.status,
                timestamp: t.timestamp.toISOString()
            }));
    }

    /**
     * Simule un webhool Wave (notification de paiement)
     * @param {Function} callback - Fonction appelée quand un paiement est confirmé
     */
    onPaymentConfirmed(callback) {
        this.paymentCallback = callback;
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaveSimulator;
}
