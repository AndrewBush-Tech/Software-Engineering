from a6_include import (DynamicArray, LinkedList,
                        hash_function_1, hash_function_2)


class HashMap:
    def __init__(self,
                 capacity: int = 11,
                 function: callable = hash_function_1) -> None:
        """
        Initialize new HashMap that uses
        separate chaining for collision resolution
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        self._buckets = DynamicArray()

        # capacity must be a prime number
        self._capacity = self._next_prime(capacity)
        for _ in range(self._capacity):
            self._buckets.append(LinkedList())

        self._hash_function = function
        self._size = 0

    def __str__(self) -> str:
        """
        Override string method to provide more readable output
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        out = ''
        for i in range(self._buckets.length()):
            out += str(i) + ': ' + str(self._buckets[i]) + '\n'
        return out

    def _next_prime(self, capacity: int) -> int:
        """
        Increment from given number and the find the closest prime number
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        if capacity % 2 == 0:
            capacity += 1

        while not self._is_prime(capacity):
            capacity += 2

        return capacity

    @staticmethod
    def _is_prime(capacity: int) -> bool:
        """
        Determine if given integer is a prime number and return boolean
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        if capacity == 2 or capacity == 3:
            return True

        if capacity == 1 or capacity % 2 == 0:
            return False

        factor = 3
        while factor ** 2 <= capacity:
            if capacity % factor == 0:
                return False
            factor += 2

        return True

    def get_size(self) -> int:
        """
        Return size of map
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        return self._size

    def get_capacity(self) -> int:
        """
        Return capacity of map
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        return self._capacity

    # ------------------------------------------------------------------ #

    def put(self, key: str, value: object) -> None:
        """
        This method updates the key/value pair in the hash map.
        """
        # Finds place in hash map to put key value pairs
        hashIndex = self._buckets.get_at_index(self._hash_function(key) % self.get_capacity())
        # Double size if load is greater or equal to 1
        if self.table_load() >= 1:
            # If key already exists resize
            if hashIndex.contains(key) is not None:
                hashIndex.remove(key)
                self._size -= 1
            hashIndex.insert(key, value)
            self._size += 1
            self.resize_table(self._next_prime(self.get_capacity()*2))
            if self._next_prime(self.get_capacity()*2) < 1:
                self._size -= 1
        # Overwrite value if key exists otherwise insert key/value pair into node
        elif hashIndex.contains(key) is not None:
            hashIndex.remove(key)
            hashIndex.insert(key, value)
        else:
            hashIndex.insert(key, value)
            self._size += 1

    def empty_buckets(self) -> int:
        """
        This method returns the number of empty buckets in the hash table.
        """
        empty = 0
        # Checks every bucket and counts and returns number of ones that are empty
        for index in range(self.get_capacity()):
            if self._buckets.get_at_index(index).length() == 0:
                empty += 1
        return empty

    def table_load(self) -> float:
        """
        This method returns the current hash table load factor.
        """
        return self.get_size()/self.get_capacity()

    def clear(self) -> None:
        """
        This method clears the contents of the hash map. It does not change the underlying hash
            table capacity.
        """
        # Iterates through creating empty linked lists and sets size to 0 in order to clear
        for index in range(0, self.get_capacity()):
            self._buckets.set_at_index(index, LinkedList())
            self._size = 0

    def resize_table(self, new_capacity: int) -> None:
        """
        This method changes the capacity of the internal hash table.
        """
        # Parameter validation for new capacity
        if new_capacity < 1:
            return
        # Sets new capacity to prime if not already
        if new_capacity >= self.get_capacity():
            if self._is_prime(new_capacity) is False:
                new_capacity = self._next_prime(new_capacity)
        else:
            while new_capacity < self.get_size():
                new_capacity = new_capacity * 2
            if self._is_prime(new_capacity) is False:
                new_capacity = self._next_prime(new_capacity)
        # Create a new list of buckets with the new capacity
        new_buckets = DynamicArray()
        for _ in range(new_capacity):
            new_buckets.append(LinkedList())
        # Rehash all the key-value pairs and store them in the new list of buckets
        for index in range(self.get_capacity()):
            for links in self._buckets.get_at_index(index):
                hashIndex = self._hash_function(links.key) % new_capacity
                new_buckets[hashIndex].insert(links.key, links.value)
        # Update the capacity and buckets of the hash map
        self._capacity = new_capacity
        self._buckets = new_buckets

    def get(self, key: str):
        """
        This method returns the value associated with the given key. If the key is not in the hash
            map, the method returns None.
        """
        # Returns None if key is not in hash map else returns value
        if self.contains_key(key) is False:
            return None
        else:
            return self._buckets.get_at_index(self._hash_function(key) % self._capacity).contains(key).value

    def contains_key(self, key: str) -> bool:
        """
        This method returns True if the given key is in the hash map, otherwise it returns False. An
            empty hash map does not contain any keys.
        """
        # Finds index and if hash map exists returns true otherwise false
        index = self._hash_function(key) % self._capacity
        if self._buckets.get_at_index(index).contains(key):
            return True
        return False

    def remove(self, key: str) -> None:
        """
        This method removes the given key and its associated value from the hash map. If the key
           is not in the hash map, the method does nothing (no exception needs to be raised).
        """
        # If key exists removes it from hash map and maintains size
        if self._buckets.get_at_index(self._hash_function(key) % self._capacity).contains(key) is not None:
            self._buckets.get_at_index(self._hash_function(key) % self._capacity).remove(key)
            self._size -= 1

    def get_keys_and_values(self) -> DynamicArray:
        """
        This method returns a dynamic array where each index contains a tuple of a key/value pair
            stored in the hash map.
        """
        # Creates dynamic array
        da = DynamicArray()
        # Iterates through buckets and appends and returns key value pairs into new dynamic array
        for index in range(self._buckets.length()):
            for link in self._buckets.get_at_index(index):
                tupleValue = (link.key, link.value)
                da.append(tupleValue)
        return da

def find_mode(da: DynamicArray) -> (DynamicArray, int):
    """
    Write a standalone function outside of the HashMap class that receives a dynamic array
        (that is not guaranteed to be sorted). This function will return a tuple containing, in this
        order, a dynamic array comprising the mode (most occurring) value/s of the array, and an
        integer that represents the highest frequency (how many times they appear).
    """
    # if you'd like to use a hash map,
    # use this instance of your Separate Chaining HashMap
    map = HashMap()
    # Initializes new dynamic array
    newDA = DynamicArray()
    for index in range(da.length()):
        # If first iteration initialize variables
        if index == 0:
            maxFreq = 1
            frequency = 1
            map.put(da.get_at_index(index), 1)
        # If map has key add to its value/frequency count
        elif map.contains_key(da.get_at_index(index)) is True:
            frequency = (map.get(da.get_at_index(index))+1)
            map.remove(da.get_at_index(index))
            map.put(da.get_at_index(index), frequency)
            if maxFreq < frequency:
                maxFreq = frequency
        # If frequency is more than max make value new max
        else:
            if maxFreq < frequency:
                maxFreq = frequency
            map.put(da.get_at_index(index), 1)
    # Iterate finding values in map that match max frequency and add to new dynamic array while erasing from map
    for index in range(da.length()):
        if map.get(da.get_at_index(index)) == maxFreq:
            newDA.append(da.get_at_index(index))
            map.remove(da.get_at_index(index))
    # return tuple with values and number of frequencies
    return (newDA, maxFreq)

# ------------------- BASIC TESTING ---------------------------------------- #

if __name__ == "__main__":

    print("\nPDF - put example 1")
    print("-------------------")
    m = HashMap(53, hash_function_1)
    for i in range(150):
        m.put('str' + str(i), i * 100)
        if i % 25 == 24:
            print(m.empty_buckets(), round(m.table_load(), 2), m.get_size(), m.get_capacity())

    print("\nPDF - put example 2")
    print("-------------------")
    m = HashMap(41, hash_function_2)
    for i in range(50):
        m.put('str' + str(i // 3), i * 100)
        if i % 10 == 9:
            print(m.empty_buckets(), round(m.table_load(), 2), m.get_size(), m.get_capacity())

    print("\nPDF - empty_buckets example 1")
    print("-----------------------------")
    m = HashMap(101, hash_function_1)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key1', 10)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key2', 20)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key1', 30)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key4', 40)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())

    print("\nPDF - empty_buckets example 2")
    print("-----------------------------")
    m = HashMap(53, hash_function_1)
    for i in range(150):
        m.put('key' + str(i), i * 100)
        if i % 30 == 0:
            print(m.empty_buckets(), m.get_size(), m.get_capacity())

    print("\nPDF - table_load example 1")
    print("--------------------------")
    m = HashMap(101, hash_function_1)
    print(round(m.table_load(), 2))
    m.put('key1', 10)
    print(round(m.table_load(), 2))
    m.put('key2', 20)
    print(round(m.table_load(), 2))
    m.put('key1', 30)
    print(round(m.table_load(), 2))

    print("\nPDF - table_load example 2")
    print("--------------------------")
    m = HashMap(53, hash_function_1)
    for i in range(50):
        m.put('key' + str(i), i * 100)
        if i % 10 == 0:
            print(round(m.table_load(), 2), m.get_size(), m.get_capacity())

    print("\nPDF - clear example 1")
    print("---------------------")
    m = HashMap(101, hash_function_1)
    print(m.get_size(), m.get_capacity())
    m.put('key1', 10)
    m.put('key2', 20)
    m.put('key1', 30)
    print(m.get_size(), m.get_capacity())
    m.clear()
    print(m.get_size(), m.get_capacity())

    print("\nPDF - clear example 2")
    print("---------------------")
    m = HashMap(53, hash_function_1)
    print(m.get_size(), m.get_capacity())
    m.put('key1', 10)
    print(m.get_size(), m.get_capacity())
    m.put('key2', 20)
    print(m.get_size(), m.get_capacity())
    m.resize_table(100)
    print(m.get_size(), m.get_capacity())
    m.clear()
    print(m.get_size(), m.get_capacity())

    print("\nPDF - resize example 1")
    print("----------------------")
    m = HashMap(23, hash_function_1)
    m.put('key1', 10)
    print(m.get_size(), m.get_capacity(), m.get('key1'), m.contains_key('key1'))
    m.resize_table(30)
    print(m.get_size(), m.get_capacity(), m.get('key1'), m.contains_key('key1'))

    print("\nPDF - resize example 2")
    print("----------------------")
    m = HashMap(79, hash_function_2)
    keys = [i for i in range(1, 1000, 13)]
    for key in keys:
        m.put(str(key), key * 42)
    print(m.get_size(), m.get_capacity())

    for capacity in range(111, 1000, 117):
        m.resize_table(capacity)

        m.put('some key', 'some value')
        result = m.contains_key('some key')
        m.remove('some key')

        for key in keys:
            # all inserted keys must be present
            result &= m.contains_key(str(key))
            # NOT inserted keys must be absent
            result &= not m.contains_key(str(key + 1))
        print(capacity, result, m.get_size(), m.get_capacity(), round(m.table_load(), 2))

    print("\nPDF - get example 1")
    print("-------------------")
    m = HashMap(31, hash_function_1)
    print(m.get('key'))
    m.put('key1', 10)
    print(m.get('key1'))

    print("\nPDF - get example 2")
    print("-------------------")
    m = HashMap(151, hash_function_2)
    for i in range(200, 300, 7):
        m.put(str(i), i * 10)
    print(m.get_size(), m.get_capacity())
    for i in range(200, 300, 21):
        print(i, m.get(str(i)), m.get(str(i)) == i * 10)
        print(i + 1, m.get(str(i + 1)), m.get(str(i + 1)) == (i + 1) * 10)

    print("\nPDF - contains_key example 1")
    print("----------------------------")
    m = HashMap(53, hash_function_1)
    print(m.contains_key('key1'))
    m.put('key1', 10)
    m.put('key2', 20)
    m.put('key3', 30)
    print(m.contains_key('key1'))
    print(m.contains_key('key4'))
    print(m.contains_key('key2'))
    print(m.contains_key('key3'))
    m.remove('key3')
    print(m.contains_key('key3'))

    print("\nPDF - contains_key example 2")
    print("----------------------------")
    m = HashMap(79, hash_function_2)
    keys = [i for i in range(1, 1000, 20)]
    for key in keys:
        m.put(str(key), key * 42)
    print(m.get_size(), m.get_capacity())
    result = True
    for key in keys:
        # all inserted keys must be present
        result &= m.contains_key(str(key))
        # NOT inserted keys must be absent
        result &= not m.contains_key(str(key + 1))
    print(result)

    print("\nPDF - remove example 1")
    print("----------------------")
    m = HashMap(53, hash_function_1)
    print(m.get('key1'))
    m.put('key1', 10)
    print(m.get('key1'))
    m.remove('key1')
    print(m.get('key1'))
    m.remove('key4')

    print("\nPDF - get_keys_and_values example 1")
    print("------------------------")
    m = HashMap(11, hash_function_2)
    for i in range(1, 6):
        m.put(str(i), str(i * 10))
    print(m.get_keys_and_values())

    m.put('20', '200')
    m.remove('1')
    m.resize_table(2)
    print(m.get_keys_and_values())

    print("\nPDF - find_mode example 1")
    print("-----------------------------")
    da = DynamicArray(["apple", "apple", "grape", "melon", "peach"])
    mode, frequency = find_mode(da)
    print(f"Input: {da}\nMode : {mode}, Frequency: {frequency}")

    print("\nPDF - find_mode example 2")
    print("-----------------------------")
    test_cases = (
        ["Arch", "Manjaro", "Manjaro", "Mint", "Mint", "Mint", "Ubuntu", "Ubuntu", "Ubuntu"],
        ["one", "two", "three", "four", "five"],
        ["2", "4", "2", "6", "8", "4", "1", "3", "4", "5", "7", "3", "3", "2"]
    )

    for case in test_cases:
        da = DynamicArray(case)
        mode, frequency = find_mode(da)
        print(f"Input: {da}\nMode : {mode}, Frequency: {frequency}\n")