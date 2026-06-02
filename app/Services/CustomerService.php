<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * @extends BaseService<Customer>
 */
class CustomerService extends BaseService
{
    /**
     * Get the model class name.
     *
     * @return class-string<Customer>
     */
    protected function model(): string
    {
        return Customer::class;
    }

    /**
     * Store a customer and its linked user account.
     */
    public function store(array $data): Model
    {
        return DB::transaction(function () use ($data): Model {
            $this->beforeStore($data);

            $customer = new Customer($data);

            $this->afterStore($customer, $data);

            $customer->save();

            return $customer->load('user');
        });
    }

    /**
     * Hook: After storing - create linked user and assign Customer role.
     *
     * @param  Customer  $customer
     */
    protected function afterStore(Model $customer, array $data): void
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $this->generateCustomerEmail($data['phone']),
            'phone' => $data['phone'],
            'password' => Str::random(32),
            'is_active' => true,
        ]);

        $user->assignRole('Customer');

        $customer->user()->associate($user);
    }

    /**
     * Hook: Before updating - prevent user_id changes.
     *
     * @param  Customer  $customer
     */
    protected function beforeUpdate(Model $customer, array &$data): void
    {
        unset($data['user_id']);
    }

    /**
     * Hook: After updating - load user relationship.
     *
     * @param  Customer  $customer
     */
    protected function afterUpdate(Model $customer, array $data): void
    {
        $customer->load('user');
    }

    /**
     * Get all customers with pagination.
     */
    public function getAllCustomers(): LengthAwarePaginator
    {
        $query = Customer::query();

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return QueryBuilder::for($query)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('phone'),
            ])
            ->allowedSorts(['name', 'phone', 'created_at'])
            ->allowedIncludes(['user'])
            ->defaultSort('-created_at')
            ->with('user')
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * Prepare customer for editing.
     */
    public function getCustomerForEdit(Customer $customer): Customer
    {
        $customer->load('user');

        return $customer;
    }

    protected function beforeDestroy(Model $customer): void
    {
        if ($customer->user) {
            $customer->user->delete();
        }
    }

    private function generateCustomerEmail(string $phone): string
    {
        $phoneKey = preg_replace('/[^A-Za-z0-9]+/', '', $phone) ?: Str::uuid()->toString();

        return strtolower("customer-{$phoneKey}@customers.local");
    }
}
