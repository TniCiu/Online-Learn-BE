<?php
namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class UserService
{
    protected $repo;

    public function __construct(UserRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getAll() { return $this->repo->all(); }
    public function find($id) { return $this->repo->find($id); }

    public function create(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        $data['id'] = Crypt::encryptString($id); 
        return $this->repo->create($data);
    }
    public function update(array $data, $id)
    {
        $user = $this->repo->find($id);
    
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
    
        return $this->repo->update($user, $data);
    }
    
   
    public function delete($id)
    {
        $user = $this->repo->find($id);
        return $this->repo->delete($user);
    }
}
