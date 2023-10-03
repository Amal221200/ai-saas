def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    sortedList = []

    for i in range(m + n):
        print(i)
        if nums1[i] >= nums2[i]:
            nums1.append(nums2[i])
            nums1.pop()
            nums2.append(0)
        else:
            sortedList.append(nums2[0])
            nums2.pop(0)
    return nums1


print(merge(nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3))
