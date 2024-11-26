// Code written by Isaac Huntsman, other attribution below.

// ###=== What it is ###=== //
// a linked list implementation with the usual functionality you would expect for a linked list, and a visualizer (print() method).
// a main method for testing the functionality, along with a memory allocation checker.

#include <iostream>
#include <vector>
#include <mach/mach.h>
using namespace std;

// this function written by chatGPT
void printMemoryUsage(const string &message)
{
    struct task_basic_info info;
    mach_msg_type_number_t infoCount = TASK_BASIC_INFO_COUNT;

    if (task_info(mach_task_self(), TASK_BASIC_INFO, (task_info_t)&info, &infoCount) == KERN_SUCCESS)
    {
        cout << message << " - Memory usage: " << info.resident_size / (1024 * 1024) << " MB\n";
    }
    else
    {
        cerr << "Failed to get memory usage info.\n";
    }
}

// ListNode struct, represents a node (in an SLL)
struct ListNode
{
    int val;

    // means "next is a pointer to a ListNode object"
    ListNode *next;

    ListNode()
    {
        this->val = 0;
        this->next = nullptr;
    }

    ListNode(int val)
    {
        this->val = val;
        this->next = nullptr;
    }

    ListNode(int val, ListNode *next)
    {
        this->val = val;
        this->next = next;
    }
};

class LinkedList
{
public:
    // ':' in c++ signifies the "initializer list", things that get initialized before constructor
    LinkedList()
        : head(nullptr), tail(nullptr)
    {
    }

    ~LinkedList()
    {
        clear();
    };

    int size;

    // add a node to the end of this linkedlist O(1) using tail pointer
    void append(int val)
    {
        ListNode *node = new ListNode(val);

        if (head == nullptr)
        {
            // initialize head & tail (empty list case)
            head = node;
            tail = node;
        }
        else
        {
            // append.
            tail->next = node;

            // update tail to the appended node
            tail = node;
        }

        size++;
    }

    // O(1)
    void addFirst(int val)
    {
        ListNode *newNode = new ListNode(val);
        if (head)
        {
            newNode->next = head;
            head = newNode;
        }
        else
        {
            head = newNode;
            tail = newNode;
        }

        size++;
    }

    // finds node then deletes it. O(N) for SLL.
    bool remove(int val)
    {
        if (!head)
            return false; // SLL empty

        // case 1 head is val
        if (head->val == val)
        {
            ListNode *temp = head;
            head = head->next;
            delete temp;
            size--;

            // if the deletion made head empty, we need to point tail to nullptr
            if (!head)
                tail = nullptr;
            return true;
        }

        // traverse to node before deletion node and bypass it.
        ListNode *current = fetchNode(val);

        // case 2 found node
        if (current->next)
        {
            // current->next is now node to be deleted.
            ListNode *temp = current->next;

            // bypass, remove from heap
            current->next = current->next->next;

            // if we're deleting the tail, current is node before, so we reassign tail.
            if (temp == tail)
                tail = current;

            delete temp;
            size--;
            return true;
        }

        // case 3 value not found
        return false;
    }

    // print to console a human-readable depiction of the current state of this SLL
    void print()
    {
        ListNode *current = head;
        while (current != nullptr)
        {
            int val = current->val;
            string sVal = to_string(val);
            cout << sVal << " -> ";
            current = current->next;
        }
        cout << "nullptr" << endl;
    }

    // check if linkedlist is empty
    bool isEmpty()
    {
        return head;
    }

    // clear this SLL. O(N)
    void clear()
    {
        while (head->next != nullptr)
        {
            ListNode *temp = head->next;
            head->next = head->next->next;
            delete temp;
        }
        head = nullptr;
        size = 0;
    }

    // Check if this SLL contains a val. O(N)
    bool contains(int val)
    {
        if (head == nullptr)
            return false;
        if (head->val == val)
            return true;

        ListNode *current = fetchNode(val);
        if (current->next == nullptr)
            return false;
        else if (current->next->val == val)
            return true;
        return false;
    }

    // fetch value in head of SLL.
    int getFirst()
    {
        return head->val;
    }

    // fetch value in tail of SLL.
    int getLast()
    {
        return tail->val;
    }

private:
    ListNode *head;

    // tracks tail
    ListNode *tail;

    ListNode *fetchNode(int val)
    {
        ListNode *current = head;

        while (current->next != nullptr && current->next->val != val)
            current = current->next;
        return current;
    }
};

int main()
{
    LinkedList *SLL = new LinkedList();
    SLL->append(6);
    SLL->append(5);
    SLL->append(4);
    SLL->append(3);
    SLL->append(2);
    SLL->print();

    cout << "fetch last" << endl;
    string s = to_string(SLL->getLast());
    cout << s << endl;

    cout << "remove 4" << endl;
    SLL->remove(4);
    SLL->print();

    cout << "fetch last" << endl;
    s = to_string(SLL->getLast());
    cout << s << endl;

    cout << "remove last" << endl;
    SLL->remove(2);
    SLL->print();

    cout << "fetch last" << endl;
    s = to_string(SLL->getLast());
    cout << s << endl;

    cout << "check contains 6 (head)" << endl;
    bool contains = SLL->contains(6);
    s = (contains == true) ? "true" : "false";
    cout << "it is " << s << " that this SLL contains 6" << endl;

    cout << "check contains 5" << endl;
    contains = SLL->contains(5);
    s = (contains == true) ? "true" : "false";
    cout << "it is " << s << " that this SLL contains 5" << endl;

    cout << "check contains 3" << endl;
    contains = SLL->contains(3);
    s = (contains == true) ? "true" : "false";
    cout << "it is " << s << " that this SLL contains 3" << endl;

    cout << "check does not contain 12" << endl;
    contains = SLL->contains(12);
    s = (contains == true) ? "true" : "false";
    cout << "it is " << s << " that this SLL contains 12" << endl;

    cout << "remove head" << endl;
    SLL->remove(6);
    SLL->print();

    cout << "get last" << endl;
    s = to_string(SLL->getLast());
    cout << s << endl;

    cout << "add the integer 200" << endl;
    SLL->append(200);
    SLL->print();
    int sz = SLL->size;
    cout << "number of nodes: " + to_string(sz) << endl;

    // mem usage test

        SLL->clear();
    printMemoryUsage("Before creating linked list");
    for (int i = 0; i < 100000000; i++) // 10M nodes
    {
        SLL->append(400);
    }

    printMemoryUsage("After creating linked list");

    SLL->clear();

    printMemoryUsage("After cleaning up linked list");

    return 0;
}
